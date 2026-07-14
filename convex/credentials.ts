import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("credentials")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .unique();
    },
});

export const getCultureDimensions = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("cultureDimensions")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .collect();
    },
});

export const getEvents = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("credentialEvents")
            .withIndex("userIdDate", (q) => q.eq("userId", userId))
            .order("desc")
            .take(20);
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
        globalScore: v.number(),
        isVerified: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("credentials", {
            ...args,
            updatedAt: Date.now(),
        });
    },
});

export const updateScore = mutation({
    args: {
        credentialId: v.id("credentials"),
        newScore: v.number(),
        previousScore: v.number(),
    },
    handler: async (ctx, { credentialId, newScore, previousScore }) => {
        await ctx.db.patch(credentialId, {
            globalScore: newScore,
            previousScore,
            updatedAt: Date.now(),
        });
    },
});

export const addEvent = mutation({
    args: {
        userId: v.id("users"),
        date: v.number(),
        event: v.string(),
        scoreChange: v.optional(v.number()),
        projectId: v.optional(v.id("projects")),
        projectName: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("credentialEvents", args);
    },
});