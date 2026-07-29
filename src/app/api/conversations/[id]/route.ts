import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Get a specific conversation with all messages
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const conversation = await prisma.conversation.findFirst({
            where: {
                id,
                userId, // Ensure user owns this conversation
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error("[CONVERSATION_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Update conversation (e.g., rename)
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { title } = await req.json();

        const conversation = await prisma.conversation.updateMany({
            where: {
                id,
                userId, // Ensure user owns this conversation
            },
            data: { title },
        });

        if (conversation.count === 0) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[CONVERSATION_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Delete conversation
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const conversation = await prisma.conversation.deleteMany({
            where: {
                id,
                userId, // Ensure user owns this conversation
            },
        });

        if (conversation.count === 0) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[CONVERSATION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

