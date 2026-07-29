import { NextResponse } from "next/server";
import { auth } from "@/lib/temp-auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { adminWithdrawalActionSchema, validateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

    const withdrawals = await prisma.withdrawal.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true },
    });

    return NextResponse.json(withdrawals);
}

export async function PATCH(req: Request) {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

    const body = await req.json();

    // Validate input
    const validation = validateSchema(adminWithdrawalActionSchema, body);
    if (!validation.success) {
        return NextResponse.json(
            { message: "Invalid input", errors: validation.errors },
            { status: 400 }
        );
    }

    const { withdrawalId, status } = validation.data!;

    try {
        const withdrawal = await prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
        if (!withdrawal) return new NextResponse("Withdrawal not found", { status: 404 });

        // Get request metadata for audit log
        const headersList = await headers();
        const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
        const userAgent = headersList.get("user-agent") || "unknown";

        if (status === "REJECTED" && withdrawal.status === "PENDING") {
            // Refund balance with optimistic locking
            await prisma.$transaction(async (tx) => {
                await tx.withdrawal.update({
                    where: { id: withdrawalId },
                    data: { status: "REJECTED", processedAt: new Date() },
                });

                await tx.user.update({
                    where: { id: withdrawal.userId },
                    data: {
                        balancePaise: { increment: withdrawal.amountPaise },
                        version: { increment: 1 },
                    },
                });

                // Create audit log
                await tx.auditLog.create({
                    data: {
                        adminId: userId,
                        action: "REJECT_WITHDRAWAL",
                        targetId: withdrawalId,
                        targetType: "Withdrawal",
                        metadata: JSON.stringify({
                            amount: withdrawal.amountPaise,
                            upiId: withdrawal.upiId,
                            targetUserId: withdrawal.userId,
                            refunded: true,
                        }),
                        ipAddress,
                        userAgent,
                    },
                });
            });
        } else {
            // Update status (APPROVED or PAID)
            await prisma.$transaction(async (tx) => {
                await tx.withdrawal.update({
                    where: { id: withdrawalId },
                    data: {
                        status,
                        processedAt: status === "PAID" ? new Date() : undefined
                    },
                });

                // Create audit log
                const action = status === "APPROVED" ? "APPROVE_WITHDRAWAL" : "PAY_WITHDRAWAL";
                await tx.auditLog.create({
                    data: {
                        adminId: userId,
                        action,
                        targetId: withdrawalId,
                        targetType: "Withdrawal",
                        metadata: JSON.stringify({
                            amount: withdrawal.amountPaise,
                            upiId: withdrawal.upiId,
                            targetUserId: withdrawal.userId,
                        }),
                        ipAddress,
                        userAgent,
                    },
                });
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_WITHDRAWAL_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
