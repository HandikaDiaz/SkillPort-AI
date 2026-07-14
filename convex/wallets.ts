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