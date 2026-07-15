import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getTransactions = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("escrowTransactions")
            .withIndex("userIdCreatedAt", (q) => q.eq("userId", userId))
            .order("desc")
            .take(50);
    },
});

export const getBalance = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const transactions = await ctx.db
            .query("escrowTransactions")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .collect();

        const available = transactions
            .filter((t) => t.type === "release" && t.status === "confirmed")
            .reduce((sum, t) => sum + t.amount, 0);

        const pending = transactions
            .filter((t) => t.status === "pending" || t.status === "processing")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalEarned = transactions
            .filter((t) => t.type === "release" && t.status === "confirmed")
            .reduce((sum, t) => sum + t.amount, 0);

        return { available, pending, totalEarned };
    },
});

export const createWithdrawal = mutation({
    args: {
        userId: v.id("users"),
        amount: v.number(),
        bankName: v.string(),
        accountNumber: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("escrowTransactions", {
            userId: args.userId,
            projectId: undefined,
            projectName: "Withdrawal",
            type: "withdrawal",
            amount: args.amount,
            currency: "IDR",
            status: "pending",
            transactionHash: undefined,
            createdAt: Date.now(),
        });
    },
});