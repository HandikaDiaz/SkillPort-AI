import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("notifications")
            .withIndex("userIdCreatedAt", (q) => q.eq("userId", userId))
            .order("desc")
            .take(20);
    },
});

export const getRecentByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("notifications")
            .withIndex("userIdCreatedAt", (q) => q.eq("userId", userId))
            .order("desc")
            .take(4);
    },
});

export const getUnreadCount = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const all = await ctx.db
            .query("notifications")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .collect();
        return all.filter((n) => !n.isRead).length;
    },
});

// ─── Mutations ─────────────────────────────────────────────────────────────────

export const create = mutation({
    args: {
        userId: v.id("users"),
        type: v.union(
            v.literal("payment"),
            v.literal("milestone"),
            v.literal("deadline"),
            v.literal("byoc"),
            v.literal("system"),
            v.literal("dispute"),
            v.literal("credential"),
        ),
        title: v.string(),
        message: v.string(),
        projectId: v.optional(v.id("projects")),
        actionUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("notifications", {
            ...args,
            isRead: false,
            createdAt: Date.now(),
        });
    },
});

export const markAsRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, { notificationId }) => {
        await ctx.db.patch(notificationId, { isRead: true });
    },
});

export const markAllRead = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const unread = await ctx.db
            .query("notifications")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isRead"), false))
            .collect();

        await Promise.all(
            unread.map((n) => ctx.db.patch(n._id, { isRead: true }))
        );
        return unread.length;
    },
});