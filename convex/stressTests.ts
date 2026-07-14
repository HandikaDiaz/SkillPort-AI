import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getLatestByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("stressTests")
            .withIndex("userIdCompletedAt", (q) => q.eq("userId", userId))
            .order("desc")
            .first();
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, { userId }) => {
        return await ctx.db.insert("stressTests", {
            userId,
            score: 0,
            status: "in_progress",
            timeSpent: 0,
            answers: [],
            dimensionScores: [],
            createdAt: Date.now(),
        });
    },
});

export const updateProgress = mutation({
    args: {
        testId: v.id("stressTests"),
        answers: v.array(
            v.object({
                questionId: v.string(),
                selectedOption: v.number(),
                dimension: v.string(),
            })
        ),
        timeSpent: v.number(),
    },
    handler: async (ctx, { testId, answers, timeSpent }) => {
        await ctx.db.patch(testId, {
            answers,
            timeSpent,
        });
    },
});

export const complete = mutation({
    args: {
        testId: v.id("stressTests"),
        score: v.number(),
        dimensionScores: v.array(
            v.object({
                dimension: v.string(),
                score: v.number(),
            })
        ),
        timeSpent: v.number(),
    },
    handler: async (ctx, { testId, score, dimensionScores, timeSpent }) => {
        await ctx.db.patch(testId, {
            score,
            dimensionScores,
            timeSpent,
            status: "completed",
            completedAt: Date.now(),
        });
    },
});