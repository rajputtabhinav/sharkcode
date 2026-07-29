"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Bot, User, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeBlock from "./CodeBlock";

interface MessageItemProps {
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
}

export default function MessageItem({ role, content, timestamp }: MessageItemProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`flex gap-2 ${role === "user" ? "flex-row-reverse" : ""} group animate-fade-in`}
        >
            <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    role === "user"
                        ? "bg-blue-600"
                        : "bg-gradient-to-br from-blue-500 to-cyan-500"
                }`}
            >
                {role === "user" ? (
                    <User className="w-3.5 h-3.5 text-white" />
                ) : (
                    <span className="text-sm">🦈</span>
                )}
            </div>
            
            <div className={`flex-1 ${role === "user" ? "flex justify-end" : ""}`}>
                <div
                    className={`max-w-[90%] ${
                        role === "user"
                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3 py-2.5"
                            : "bg-slate-100 text-slate-900 rounded-2xl rounded-tl-sm px-3 py-2.5"
                    }`}
                >
                    {role === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0 prose-p:text-sm prose-p:leading-relaxed">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        const codeString = String(children).replace(/\n$/, "");
                                        
                                        return !inline && match ? (
                                            <CodeBlock
                                                language={match[1]}
                                                code={codeString}
                                            />
                                        ) : (
                                            <code
                                                className="bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded text-xs font-mono"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    p: ({ children }) => <p className="mb-2 last:mb-0 text-sm">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-sm">{children}</ol>,
                                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                                    a: ({ children, href }) => (
                                        <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                            {children}
                                        </a>
                                    ),
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
                    )}
                    
                    {timestamp && (
                        <p className="text-[9px] opacity-40 mt-1.5">
                            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                </div>
                
                {role === "assistant" && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopy}
                        className="mt-1 h-7 px-2 text-xs"
                    >
                        {copied ? (
                            <Check className="w-3 h-3" />
                        ) : (
                            <Copy className="w-3 h-3" />
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

