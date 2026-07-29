"use client";

import { useState, useRef, useEffect } from "react";
// import { useAuth } from "@clerk/nextjs"; // Removed - auth temporarily disabled
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, RefreshCw, Menu, User, LogIn, UserPlus } from "lucide-react";
import MessageItem from "@/components/chat/MessageItem";
import ConversationModal from "@/components/chat/ConversationModal";

export const dynamic = "force-dynamic";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt?: Date;
};

export default function ChatPage() {
    // Temporary: Auth disabled - set isSignedIn to false, isLoaded to true
    const isSignedIn = false;
    const isLoaded = true;
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showConversations, setShowConversations] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch all conversations (only if signed in)
    const { data: conversations, mutate: mutateConversations } = useSWR(
        isSignedIn ? "/api/conversations" : null,
        fetcher
    );

    // Fetch active conversation messages
    const { data: activeConversation, mutate: mutateActiveConversation } = useSWR(
        isSignedIn && activeConversationId ? `/api/conversations/${activeConversationId}` : null,
        fetcher
    );

    // Load messages when conversation changes
    useEffect(() => {
        if (activeConversation) {
            setMessages(
                activeConversation.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    createdAt: new Date(m.createdAt),
                }))
            );
        } else {
            // Welcome message for new chat
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: `# Welcome to SharkAI! 🦈

I'm your intelligent AI assistant powered by advanced reasoning. I can help with:

**Programming & Tech**
- Write and debug code in any language
- Explain technical concepts
- Review and optimize code

**SharkCode Platform**
- Referral system and earnings
- Withdrawals and Pro membership
- Platform features and tips

**General Help**
- Problem solving and analysis
- Writing and content creation
- Learning and explanations

What would you like to know?`,
                },
            ]);
        }
    }, [activeConversation]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!isSignedIn) {
            toast.error("Please sign in to chat with SharkAI");
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev.filter((m) => m.id !== "welcome"), userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages.filter((m) => m.id !== "welcome"), userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    conversationId: activeConversationId,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to get response");
            }

            const data = await res.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            // Update active conversation ID if it was a new chat
            if (!activeConversationId && data.conversationId) {
                setActiveConversationId(data.conversationId);
            }

            // Refresh conversation list
            mutateConversations();
            if (activeConversationId) {
                mutateActiveConversation();
            }
        } catch (error) {
            toast.error("Failed to get response. Please try again.");
            // Remove user message on error
            setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleNewChat = async () => {
        setActiveConversationId(null);
        setMessages([
            {
                id: "welcome",
                role: "assistant",
                content: "# New Chat Started!\n\nHow can I assist you today?",
            },
        ]);
        mutateConversations();
    };

    const handleSelectConversation = (id: string) => {
        setActiveConversationId(id);
    };

    const handleDeleteConversation = async (id: string) => {
        try {
            await fetch(`/api/conversations/${id}`, { method: "DELETE" });
            toast.success("Conversation deleted");
            
            if (activeConversationId === id) {
                handleNewChat();
            }
            
            mutateConversations();
        } catch (error) {
            toast.error("Failed to delete conversation");
        }
    };

    const handleRenameConversation = async (id: string, newTitle: string) => {
        try {
            await fetch(`/api/conversations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle }),
            });
            toast.success("Conversation renamed");
            mutateConversations();
        } catch (error) {
            toast.error("Failed to rename conversation");
        }
    };

    const handleRegenerateResponse = async () => {
        if (messages.length < 2) return;

        // Remove last assistant message
        const filteredMessages = messages.slice(0, -1);
        if (filteredMessages[filteredMessages.length - 1].role !== "user") return;

        setMessages(filteredMessages);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: filteredMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    conversationId: activeConversationId,
                }),
            });

            if (!res.ok) throw new Error("Failed to regenerate");

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: data.message,
                },
            ]);

            mutateActiveConversation();
        } catch (error) {
            toast.error("Failed to regenerate response");
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = [
        "What is SharkCode?",
        "Help me write code",
        "How to earn money?",
    ];

    // Show loading while checking auth
    if (!isLoaded) {
        return (
            <div className="flex flex-col h-full items-center justify-center">
                <div className="text-5xl animate-pulse mb-4">🦈</div>
                <p className="text-slate-500">Loading...</p>
            </div>
        );
    }

    // Show sign in prompt for non-logged-in users
    if (!isSignedIn) {
        return (
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-white">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🦈</span>
                        <div>
                            <h1 className="text-base font-bold text-slate-900">SharkAI</h1>
                            <p className="text-[10px] text-slate-500">AI Assistant</p>
                        </div>
                    </div>
                </div>

                {/* Auth Prompt */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-6xl mb-6 animate-bounce">🦈</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Welcome to SharkAI
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-xs">
                        Sign in to start chatting with our advanced AI assistant and unlock all features.
                    </p>
                    
                    <div className="w-full max-w-xs space-y-3">
                        <Link href="/sign-in" className="block w-full">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold">
                                <LogIn className="w-4 h-4 mr-2" />
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/sign-up" className="block w-full">
                            <Button variant="outline" className="w-full h-12 text-base font-semibold border-2">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create Account
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 max-w-xs">
                        <p className="text-sm text-blue-800 font-medium mb-2">
                            🎁 Get ₹50 Signup Bonus!
                        </p>
                        <p className="text-xs text-blue-600">
                            Create your account now and start earning through referrals.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowConversations(true)}
                        className="shrink-0"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🦈</span>
                        <div>
                            <h1 className="text-base font-bold text-slate-900">SharkAI</h1>
                            <p className="text-[10px] text-slate-500">AI Assistant</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {messages.length > 1 && messages[messages.length - 1].role === "assistant" && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleRegenerateResponse}
                            disabled={isLoading}
                            className="h-8 text-xs"
                        >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Retry
                        </Button>
                    )}
                    <Link href="/profile">
                        <Button size="icon" variant="ghost" className="shrink-0">
                            <User className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        role={message.role}
                        content={message.content}
                        timestamp={message.createdAt}
                    />
                ))}

                {isLoading && (
                    <div className="flex gap-2 animate-fade-in">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-sm">🦈</span>
                        </div>
                        <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-3 py-2">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions (show only at start) */}
            {messages.length === 1 && messages[0].id === "welcome" && (
                <div className="px-3 pb-2">
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q) => (
                            <button
                                key={q}
                                onClick={() => setInput(q)}
                                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white">
                <div className="flex gap-2">
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        disabled={isLoading}
                        className="flex-1 rounded-xl h-11"
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 h-11"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </form>

            {/* Conversation Modal */}
            <ConversationModal
                isOpen={showConversations}
                onClose={() => setShowConversations(false)}
                conversations={conversations || []}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleNewChat}
                onDeleteConversation={handleDeleteConversation}
                onRenameConversation={handleRenameConversation}
            />
        </div>
    );
}
