import { NextResponse } from "next/server";
import { auth } from "@/lib/temp-auth";
import { prisma } from "@/lib/db";
import { paymentSchema, validateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();

        // Validate input
        const validation = validateSchema(paymentSchema, body);
        if (!validation.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: validation.errors },
                { status: 400 }
            );
        }

        const { amountPaise, upiRef } = validation.data!;

        // Check for duplicate upiRef
        const existingPayment = await prisma.payment.findUnique({
            where: { upiRef },
        });

        if (existingPayment) {
            return NextResponse.json(
                { message: "This UPI reference has already been submitted" },
                { status: 409 }
            );
        }

        const payment = await prisma.payment.create({
            data: {
                userId,
                amountPaise,
                upiRef,
                status: "PENDING",
            },
        });

        return NextResponse.json(payment);
    } catch (error) {
        console.error("[PAYMENT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const payments = await prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error("[PAYMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
