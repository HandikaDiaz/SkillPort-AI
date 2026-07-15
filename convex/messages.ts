import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getConversations = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        const allConversations = await ctx.db.query("conversations").collect();

        return allConversations.filter((conv) =>
            conv.participants.some((p) => p.id === userId)
        );
    },
});

export const getMessages = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, { conversationId }) => {
        return await ctx.db
            .query("messages")
            .withIndex("conversationIdCreatedAt", (q) => q.eq("conversationId", conversationId))
            .order("asc")
            .collect();
    },
});

export const send = mutation({
    args: {
        conversationId: v.id("conversations"),
        senderId: v.string(),
        senderName: v.string(),
        senderAvatar: v.optional(v.string()),
        content: v.string(),
        type: v.optional(v.union(v.literal("text"), v.literal("file"), v.literal("milestone_pin"), v.literal("system"))),
    },
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("messages", {
            ...args,
            type: args.type || "text",
            createdAt: Date.now(),
            readBy: [args.senderId],
        });

        // Update conversation lastMessage
        await ctx.db.patch(args.conversationId, {
            lastMessage: args.content,
            lastMessageAt: Date.now(),
        });

        return messageId;
    },
});

export const markAsRead = mutation({
    args: {
        conversationId: v.id("conversations"),
        userId: v.string(),
    },
    handler: async (ctx, { conversationId, userId }) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("conversationId", (q) => q.eq("conversationId", conversationId))
            .collect();

        for (const msg of messages) {
            if (!msg.readBy.includes(userId)) {
                await ctx.db.patch(msg._id, {
                    readBy: [...msg.readBy, userId],
                });
            }
        }
    },
});

export const createConversation = mutation({
    args: {
        projectId: v.id("projects"),
        projectName: v.string(),
        participants: v.array(
            v.object({
                id: v.string(),
                name: v.string(),
                avatar: v.string(),
                role: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("conversations", {
            ...args,
            lastMessage: "",
            lastMessageAt: Date.now(),
            unreadCount: 0,
            status: "active",
        });
    },
});