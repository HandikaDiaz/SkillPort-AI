import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("transactions")
            .withIndex("userIdCreatedAt", (q) => q.eq("userId", userId))
            .order("desc")
            .take(50);
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
        type: v.union(
            v.literal("withdrawal"),
            v.literal("escrow_in"),
            v.literal("escrow_release"),
            v.literal("refund"),
            v.literal("fee"),
            v.literal("bonus"),
        ),
        amount: v.number(),
        currency: v.string(),
        projectId: v.optional(v.id("projects")),
        projectName: v.optional(v.string()),
        bankName: v.optional(v.string()),
        accountNumber: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("transactions", {
            ...args,
            status: "pending",
            createdAt: Date.now(),
        });
    },
});

export const updateStatus = mutation({
    args: {
        transactionId: v.id("transactions"),
        status: v.union(
            v.literal("success"),
            v.literal("processing"),
            v.literal("failed"),
            v.literal("pending"),
        ),
        transactionHash: v.optional(v.string()),
    },
    handler: async (ctx, { transactionId, status, transactionHash }) => {
        const update: any = { status };
        if (transactionHash) update.transactionHash = transactionHash;
        if (status === "success" || status === "failed") {
            update.completedAt = Date.now();
        }
        await ctx.db.patch(transactionId, update);
    },
});