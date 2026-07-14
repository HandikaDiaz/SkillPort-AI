import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("userSettings")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .unique();
    },
});

export const upsert = mutation({
    args: {
        userId: v.id("users"),
        displayName: v.optional(v.string()),
        title: v.optional(v.string()),
        bio: v.optional(v.string()),
        location: v.optional(v.string()),
        languages: v.optional(v.array(v.string())),
        hourlyRate: v.optional(v.number()),
        projectRate: v.optional(v.number()),
        skills: v.optional(v.array(v.string())),
        githubUrl: v.optional(v.string()),
        behanceUrl: v.optional(v.string()),
        dribbbleUrl: v.optional(v.string()),
        projectTypes: v.optional(v.array(v.string())),
        minBudget: v.optional(v.number()),
        maxBudget: v.optional(v.number()),
        preferredRegions: v.optional(v.array(v.string())),
        availability: v.optional(v.array(v.string())),
        notifyMilestoneApproved: v.optional(v.boolean()),
        notifyPaymentReceived: v.optional(v.boolean()),
        notifyByocInvite: v.optional(v.boolean()),
        notifyDeadlineReminder: v.optional(v.boolean()),
        notifyWeeklySummary: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("userSettings")
            .withIndex("userId", (q) => q.eq("userId", args.userId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                ...args,
                updatedAt: Date.now(),
            });
            return existing._id;
        }

        return await ctx.db.insert("userSettings", {
            ...args,
            updatedAt: Date.now(),
        });
    },
});