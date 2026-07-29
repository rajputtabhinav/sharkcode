import { NextResponse } from "next/server";
import { auth } from "@/lib/temp-auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { adminPaymentActionSchema, validateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

    const payments = await prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true },
    });

    return NextResponse.json(payments);
}

export async function PATCH(req: Request) {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

    const body = await req.json();
    
    // Validate input
    const validation = validateSchema(adminPaymentActionSchema, body);
    if (!validation.success) {
        return NextResponse.json(
            { message: "Invalid input", errors: validation.errors },
            { status: 400 }
        );
    }

    const { paymentId, status } = validation.data!;

    try {
        const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment) return new NextResponse("Payment not found", { status: 404 });

        if (payment.status !== "PENDING") {
            return new NextResponse("Payment already processed", { status: 400 });
        }

        // Get request metadata for audit log
        const headersList = await headers();
        const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
        const userAgent = headersList.get("user-agent") || "unknown";

        if (status === "CONFIRMED") {
            // Upgrade user to Pro and give referral reward
            await prisma.$transaction(async (tx) => {
                await tx.payment.update({
                    where: { id: paymentId },
                    data: { status: "CONFIRMED", confirmedAt: new Date() },
                });

                const targetUser = await tx.user.update({
                    where: { id: payment.userId },
                    data: { isPro: true },
                });

                // Create audit log
                await tx.auditLog.create({
                    data: {
                        adminId: userId,
                        action: "APPROVE_PAYMENT",
                        targetId: paymentId,
                        targetType: "Payment",
                        metadata: JSON.stringify({
                            amount: payment.amountPaise,
                            upiRef: payment.upiRef,
                            targetUserId: payment.userId,
                        }),
                        ipAddress,
                        userAgent,
                    },
                });

                // Referral Reward: If referrer is Pro -> +₹80
                if (targetUser.referredByCode) {
                    const referrer = await tx.user.findUnique({
                        where: { referralCode: targetUser.referredByCode },
                    });

                    if (referrer && referrer.isPro) {
                        await tx.user.update({
                            where: { id: referrer.id },
                            data: {
                                balancePaise: { increment: 8000 },
                                totalEarnedPaise: { increment: 8000 },
                                totalProReferrals: { increment: 1 },
                                version: { increment: 1 },
                            },
                        });

                        await tx.referralEvent.create({
                            data: {
                                referrerId: referrer.id,
                                referredUserId: targetUser.id,
                                type: "PRO_PURCHASE",
                                amountPaise: 8000,
                            },
                        });
                    }
                }
            });
        } else {
            await prisma.$transaction(async (tx) => {
                await tx.payment.update({
                    where: { id: paymentId },
                    data: { status: "REJECTED" },
                });

                // Create audit log
                await tx.auditLog.create({
                    data: {
                        adminId: userId,
                        action: "REJECT_PAYMENT",
                        targetId: paymentId,
                        targetType: "Payment",
                        metadata: JSON.stringify({
                            amount: payment.amountPaise,
                            upiRef: payment.upiRef,
                            targetUserId: payment.userId,
                        }),
                        ipAddress,
                        userAgent,
                    },
                });
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_PAYMENT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
