import { NextResponse } from "next/server";
import { auth } from "@/lib/temp-auth";
import { prisma } from "@/lib/db";
import { chatMessageSchema, validateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are SharkAI, a highly capable AI assistant powered by advanced reasoning capabilities.

You excel at:
- Programming & Software Development (all languages, frameworks, debugging, architecture)
- Technical Explanations (clear, detailed, with examples and step-by-step reasoning)
- Problem Solving & Analysis (breaking down complex problems, finding optimal solutions)
- Writing & Content Creation (articles, documentation, creative writing)
- Math, Science, and General Knowledge
- SharkCode Platform Expertise

About SharkCode Platform:
- Sign up bonus: ₹50 instantly credited
- Pro Membership: ₹100 one-time payment unlocks referral system
- Earnings: ₹10 per referral signup + ₹80 when they upgrade to Pro
- Withdrawals: Minimum ₹100, processed via UPI in 24-48 hours
- Users can track earnings, manage referrals, and view transaction history

Communication Style:
- Be helpful, clear, and thorough
- Use markdown formatting for better readability
- Include code examples with proper syntax highlighting
- Break complex topics into digestible parts
- Show your reasoning process when solving problems
- Ask clarifying questions when needed
- Be encouraging and supportive

Formatting:
- Use **bold** for emphasis
- Use \`code\` for inline code
- Use code blocks with language tags for multi-line code
- Use lists for steps or multiple items
- Use tables when comparing data
- Use headers to organize long responses

Important:
- Never share sensitive information
- Don't make promises about specific earning amounts
- For technical platform issues, suggest contacting support@sharkcode.com
- Be honest if you don't know something
- When reasoning through problems, show your thought process`;

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();

        // Validate input
        const validation = validateSchema(chatMessageSchema, body);
        if (!validation.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: validation.errors },
                { status: 400 }
            );
        }

        const { messages, conversationId } = body;

        // If conversationId provided, verify ownership and save to database
        let conversation;
        if (conversationId) {
            conversation = await prisma.conversation.findFirst({
                where: { id: conversationId, userId },
            });

            if (!conversation) {
                return new NextResponse("Conversation not found", { status: 404 });
            }
        } else {
            // Create new conversation if none provided
            conversation = await prisma.conversation.create({
                data: {
                    userId,
                    title: "New Chat",
                },
            });
        }

        // Save user message to database
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === "user") {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    role: "user",
                    content: lastMessage.content,
                },
            });

            // Auto-generate title from first user message if still "New Chat"
            if (conversation.title === "New Chat" && messages.length === 1) {
                const titleSuggestion = lastMessage.content.slice(0, 50);
                await prisma.conversation.update({
                    where: { id: conversation.id },
                    data: { title: titleSuggestion + (lastMessage.content.length > 50 ? "..." : "") },
                });
            }
        }

        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error("OPENROUTER_API_KEY not configured");
            return new NextResponse("AI service not configured", { status: 500 });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://sharkcode.com",
                "X-Title": "SharkCode AI Assistant",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...messages.slice(-15), // Keep last 15 messages for context
                ],
                max_tokens: 4000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("OpenRouter API error:", errorData);
            return new NextResponse("AI service error", { status: 500 });
        }

        const data = await response.json();
        const assistantMessage = data.choices?.[0]?.message?.content;

        if (!assistantMessage) {
            return new NextResponse("No response from AI", { status: 500 });
        }

        // Save assistant message to database
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: "assistant",
                content: assistantMessage,
            },
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json({
            message: assistantMessage,
            conversationId: conversation.id,
        });
    } catch (error) {
        console.error("[CHAT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
