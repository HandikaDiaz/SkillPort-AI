import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("wallets")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .unique();
    },
});

// Get wallet jika ada, atau buat baru dengan saldo 0 jika belum ada.
// Berguna untuk user baru agar tidak crash saat pertama kali login.
export const getOrCreate = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const existing = await ctx.db
            .query("wallets")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .unique();

        if (existing) return existing;

        const id = await ctx.db.insert("wallets", {
            userId,
            balance: 0,
            balanceUsd: 0,
            totalEarned: 0,
            totalEarnedUsd: 0,
            pendingSettlement: 0,
            pendingSettlementUsd: 0,
            updatedAt: Date.now(),
        });
        return await ctx.db.get(id);
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
        balance: v.number(),
        balanceUsd: v.number(),
        totalEarned: v.number(),
        totalEarnedUsd: v.number(),
        pendingSettlement: v.number(),
        pendingSettlementUsd: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("wallets", {
            ...args,
            updatedAt: Date.now(),
        });
    },
});