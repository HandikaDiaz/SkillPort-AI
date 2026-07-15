"use client";

import { formatRelativeTime } from "@/lib/utils";

interface ConversationListProps {
    conversation: any;
    currentUserId: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function ConversationList({
    conversation,
    currentUserId,
    isSelected,
    onClick,
}: ConversationListProps) {
    const otherParticipant = conversation.participants.find(
        (p: any) => p.id !== currentUserId
    );

    const unreadCount = 0; // TODO: calculate from messages

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 border-b border-neutral-100 transition-colors ${isSelected ? "bg-neutral-50 border-l-4 border-l-secondary-500" : "hover:bg-neutral-50"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img
                        src={otherParticipant?.avatar || "/default-avatar.png"}
                        alt={otherParticipant?.name}
                        className="w-10 h-10 rounded-full"
                    />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="text-body-sm font-medium text-primary-800 truncate">
                            {otherParticipant?.name}
                        </p>
                        <span className="text-caption text-neutral-400 flex-shrink-0">
                            {formatRelativeTime(conversation.lastMessageAt)}
                        </span>
                    </div>
                    <p className="text-caption text-neutral-500 truncate">
                        {conversation.lastMessage || "Belum ada pesan"}
                    </p>
                    <p className="text-caption text-neutral-400 truncate">
                        {conversation.projectName}
                    </p>
                </div>
            </div>
        </button>
    );
}