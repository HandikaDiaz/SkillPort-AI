import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        emailVerified: v.optional(v.number()),
        passwordHash: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.email))
            .unique();

        if (existing) {
            throw new Error("User already exists");
        }

        const userId = await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            emailVerified: args.emailVerified,
            image: undefined,
        });

        if (args.passwordHash) {
            await ctx.db.insert("passwords", {
                userId,
                hash: args.passwordHash,
            });
        }

        return userId;
    },
});

export const getByEmail = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, { email }) => {
        return await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", email))
            .unique();
    },
});

export const getPasswordHash = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, { userId }) => {
        const password = await ctx.db
            .query("passwords")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .unique();
        return password?.hash ?? null;
    },
});