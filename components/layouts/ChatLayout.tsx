"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, MessageSquare } from "lucide-react";
import ConversationList from "../messages/messageList";
import ChatWindow from "../messages/ChatWindow";

interface ChatLayoutProps {
    userRole: "client" | "talent";
}

export default function ChatLayout({ userRole }: ChatLayoutProps) {
    const { data: session } = useSession();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const conversations = useQuery(
        api.messages.getConversations,
        session?.user?.id ? { userId: session.user.id } : "skip"
    );

    const filteredConversations = conversations?.filter((conv) =>
        conv.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* Sidebar - Conversation List */}
            <div className="w-80 border-r border-neutral-200 flex flex-col">
                <div className="p-4 border-b border-neutral-200">
                    <h2 className="text-h4 text-primary-900 mb-3">Pesan</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari percakapan..."
                            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                            <MessageSquare className="w-12 h-12 mb-2 text-neutral-300" />
                            <p className="text-body-sm">Belum ada percakapan</p>
                        </div>
                    ) : (
                        filteredConversations?.map((conv) => (
                            <ConversationList
                                key={conv._id}
                                conversation={conv}
                                currentUserId={session?.user?.id || ""}
                                isSelected={conv._id === selectedConversationId}
                                onClick={() => setSelectedConversationId(conv._id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedConversationId ? (
                    <ChatWindow
                        conversationId={selectedConversationId}
                        currentUserId={session?.user?.id || ""}
                        currentUserName={session?.user?.name || ""}
                        currentUserImage={session?.user?.image || ""}
                        userRole={userRole}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-neutral-500">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                            <p className="text-body text-neutral-500">Pilih percakapan untuk memulai</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}