"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
    language?: string;
    code: string;
}

export default function CodeBlock({ language = "text", code }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4">
            <div className="absolute right-2 top-2 z-10">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="bg-slate-700/80 hover:bg-slate-700 text-white h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3 mr-1" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                        </>
                    )}
                </Button>
            </div>
            {language && language !== "text" && (
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-300 font-mono rounded-t-lg border-b border-slate-700">
                    {language}
                </div>
            )}
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    borderRadius: language && language !== "text" ? "0 0 0.5rem 0.5rem" : "0.5rem",
                    fontSize: "0.875rem",
                }}
                showLineNumbers
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

