"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Send, Paperclip, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
    conversationId: string;
    currentUserId: string;
    currentUserName: string;
    currentUserImage: string;
}

export default function ChatWindow({
    conversationId,
    currentUserId,
    currentUserName,
    currentUserImage,
}: ChatWindowProps) {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messages = useQuery(api.messages.getMessages, {
        conversationId: conversationId as any,
    });

    const sendMessage = useMutation(api.messages.send);
    const markAsRead = useMutation(api.messages.markAsRead);

    const conversation = useQuery(
        api.messages.getConversations,
        { userId: currentUserId }
    )?.find((c) => c._id === conversationId);

    const otherParticipant = conversation?.participants.find(
        (p: any) => p.id !== currentUserId
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Mark as read when opening
    useEffect(() => {
        if (conversationId) {
            markAsRead({ conversationId: conversationId as any, userId: currentUserId });
        }
    }, [conversationId, currentUserId, markAsRead]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await sendMessage({
                conversationId: conversationId as any,
                senderId: currentUserId,
                senderName: currentUserName,
                senderAvatar: currentUserImage,
                content: message.trim(),
                type: "text",
            });
            setMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Group messages by date
    const groupedMessages = messages?.reduce((groups: any, msg: any) => {
        const date = new Date(msg.createdAt).toDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
        return groups;
    }, {});

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
                <img
                    src={otherParticipant?.avatar || "/default-avatar.png"}
                    alt={otherParticipant?.name}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <p className="text-body-sm font-medium text-primary-800">
                        {otherParticipant?.name}
                    </p>
                    <p className="text-caption text-neutral-500">
                        {conversation?.projectName}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {groupedMessages &&
                    Object.entries(groupedMessages).map(([date, msgs]: [string, any]) => (
                        <div key={date}>
                            <div className="flex justify-center mb-4">
                                <span className="text-caption text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
                                    {formatDate(parseInt(date))}
                                </span>
                            </div>
                            {msgs.map((msg: any) => {
                                const isMe = msg.senderId === currentUserId;
                                return (
                                    <div
                                        key={msg._id}
                                        className={`flex gap-3 mb-4 ${isMe ? "flex-row-reverse" : ""}`}
                                    >
                                        {!isMe && (
                                            <img
                                                src={msg.senderAvatar || "/default-avatar.png"}
                                                alt={msg.senderName}
                                                className="w-8 h-8 rounded-full flex-shrink-0"
                                            />
                                        )}
                                        <div
                                            className={`max-w-[70%] ${isMe ? "items-end" : "items-start"
                                                }`}
                                        >
                                            <div
                                                className={`px-4 py-2 rounded-xl ${isMe
                                                        ? "bg-secondary-500 text-white rounded-br-none"
                                                        : "bg-neutral-100 text-primary-800 rounded-bl-none"
                                                    }`}
                                            >
                                                <p className="text-body-sm">{msg.content}</p>
                                            </div>
                                            <span className="text-caption text-neutral-400 mt-1">
                                                {formatTime(msg.createdAt)}
                                                {isMe && (
                                                    <span className="ml-1">
                                                        {msg.readBy.length > 1 ? "✓✓" : "✓"}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                className="p-4 border-t border-neutral-200 flex items-center gap-3"
            >
                <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400"
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400"
                >
                    <Milestone className="w-5 h-5" />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                />
                <Button
                    type="submit"
                    size="sm"
                    className="bg-secondary-500 hover:bg-secondary-600 text-white"
                    disabled={!message.trim()}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}