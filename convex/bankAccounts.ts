import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("bankAccounts")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .collect();
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
        bankName: v.string(),
        accountNumber: v.string(),
        accountHolder: v.string(),
        isDefault: v.boolean(),
    },
    handler: async (ctx, args) => {
        if (args.isDefault) {
            const existing = await ctx.db
                .query("bankAccounts")
                .withIndex("userId", (q) => q.eq("userId", args.userId))
                .collect();
            for (const acc of existing) {
                await ctx.db.patch(acc._id, { isDefault: false });
            }
        }
        return await ctx.db.insert("bankAccounts", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const remove = mutation({
    args: { bankAccountId: v.id("bankAccounts") },
    handler: async (ctx, { bankAccountId }) => {
        await ctx.db.delete(bankAccountId);
    },
});

export const setDefault = mutation({
    args: {
        bankAccountId: v.id("bankAccounts"),
        userId: v.id("users"),
    },
    handler: async (ctx, { bankAccountId, userId }) => {
        // Un-default semua rekening milik user ini
        const all = await ctx.db
            .query("bankAccounts")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .collect();

        await Promise.all(
            all.map((acc) =>
                ctx.db.patch(acc._id, {
                    isDefault: acc._id === bankAccountId,
                })
            )
        );
    },
});