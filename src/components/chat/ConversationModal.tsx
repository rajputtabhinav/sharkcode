"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, PlusCircle, Trash2, Edit2, X, Check } from "lucide-react";

interface Conversation {
    id: string;
    title: string;
    updatedAt: string;
    _count: { messages: number };
}

interface ConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewChat: () => void;
    onDeleteConversation: (id: string) => void;
    onRenameConversation: (id: string, newTitle: string) => void;
}

export default function ConversationModal({
    isOpen,
    onClose,
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewChat,
    onDeleteConversation,
    onRenameConversation,
}: ConversationModalProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    if (!isOpen) return null;

    const startEdit = (id: string, currentTitle: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(id);
        setEditTitle(currentTitle);
    };

    const saveEdit = () => {
        if (editingId && editTitle.trim()) {
            onRenameConversation(editingId, editTitle.trim());
            setEditingId(null);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
    };

    const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Delete "${title}"?`)) {
            onDeleteConversation(id);
        }
    };

    const handleSelect = (id: string) => {
        onSelectConversation(id);
        onClose();
    };

    const handleNewChat = () => {
        onNewChat();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="absolute inset-x-0 top-0 bottom-0 bg-white animate-slide-up flex flex-col max-w-[420px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">Conversations</h2>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onClose}
                        className="shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* New Chat Button */}
                <div className="p-4 border-b border-slate-100">
                    <Button
                        onClick={handleNewChat}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Chat
                    </Button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {conversations.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">No conversations yet</p>
                            <p className="text-slate-400 text-xs mt-1">Start a new chat to get started</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={`relative rounded-xl border transition-all ${
                                    activeConversationId === conv.id
                                        ? "bg-blue-50 border-blue-200"
                                        : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                            >
                                {editingId === conv.id ? (
                                    <div className="p-3 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEdit();
                                                if (e.key === "Escape") cancelEdit();
                                            }}
                                            className="flex-1 bg-slate-100 text-slate-900 px-3 py-2 rounded-lg text-sm outline-none border border-slate-300 focus:border-blue-500"
                                            autoFocus
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={saveEdit}
                                            className="h-8 w-8 text-green-600 hover:bg-green-50"
                                        >
                                            <Check className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={cancelEdit}
                                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => handleSelect(conv.id)}
                                        className="p-4 cursor-pointer"
                                    >
                                        <div className="flex items-start gap-3">
                                            <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm text-slate-900 truncate mb-1">
                                                    {conv.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>{conv._count.messages} messages</span>
                                                    <span>•</span>
                                                    <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={(e) => startEdit(conv.id, conv.title, e)}
                                                    className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={(e) => handleDelete(conv.id, conv.title, e)}
                                                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

