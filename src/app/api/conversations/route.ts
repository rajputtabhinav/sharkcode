import { NextResponse } from "next/server";
import { auth } from "@/lib/temp-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Get all conversations for the current user
export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const conversations = await prisma.conversation.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                    take: 1, // Get first message for preview
                },
                _count: {
                    select: { messages: true }
                }
            },
        });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("[CONVERSATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Create a new conversation
export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { title } = await req.json();

        const conversation = await prisma.conversation.create({
            data: {
                userId,
                title: title || "New Chat",
            },
        });

        return NextResponse.json(conversation);
    } catch (error) {
        console.error("[CONVERSATION_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

