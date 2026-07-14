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