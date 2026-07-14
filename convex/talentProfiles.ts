import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("talentProfiles")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .unique();
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
        role: v.string(),
        location: v.string(),
        skills: v.array(v.string()),
        hourlyRate: v.number(),
        projectRate: v.number(),
        availability: v.union(v.literal("available"), v.literal("busy"), v.literal("part_time")),
        credentialScore: v.number(),
        isVerified: v.boolean(),
        completedProjects: v.number(),
        onTimeRate: v.number(),
        disputeRate: v.number(),
        yearsExperience: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("talentProfiles", args);
    },
});