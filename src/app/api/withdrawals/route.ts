import { NextResponse } from "next/server";
import { auth } from "@/lib/temp-auth";
import { prisma } from "@/lib/db";
import { withdrawalSchema, validateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();

        // Validate input
        const validation = validateSchema(withdrawalSchema, body);
        if (!validation.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: validation.errors },
                { status: 400 }
            );
        }

        const { amountPaise, upiId } = validation.data!;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { balancePaise: true, version: true },
        });

        if (!user || user.balancePaise < amountPaise) {
            return NextResponse.json(
                { message: "Insufficient balance" },
                { status: 400 }
            );
        }

        // Use optimistic locking to prevent race conditions
        const result = await prisma.$transaction(async (tx) => {
            // Update with version check
            const updatedUser = await tx.user.updateMany({
                where: {
                    id: userId,
                    version: user.version, // Optimistic lock check
                    balancePaise: { gte: amountPaise }, // Double-check balance
                },
                data: {
                    balancePaise: { decrement: amountPaise },
                    version: { increment: 1 }, // Increment version
                },
            });

            if (updatedUser.count === 0) {
                throw new Error("Balance changed, please try again");
            }

            const withdrawal = await tx.withdrawal.create({
                data: {
                    userId,
                    amountPaise,
                    upiId,
                    status: "PENDING",
                },
            });

            return withdrawal;
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("[WITHDRAWAL_POST]", error);
        
        if (error.message === "Balance changed, please try again") {
            return NextResponse.json(
                { message: error.message },
                { status: 409 }
            );
        }
        
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const withdrawals = await prisma.withdrawal.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(withdrawals);
    } catch (error) {
        console.error("[WITHDRAWALS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
