import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByProject = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, { projectId }) => {
        return await ctx.db
            .query("milestones")
            .withIndex("projectId", (q) => q.eq("projectId", projectId))
            .collect();
    },
});

export const updateStatus = mutation({
    args: {
        milestoneId: v.id("milestones"),
        status: v.union(
            v.literal("pending"),
            v.literal("in_progress"),
            v.literal("submitted"),
            v.literal("approved"),
            v.literal("rejected"),
        ),
        deliverables: v.optional(v.array(v.string())),
    },
    handler: async (ctx, { milestoneId, status, deliverables }) => {
        const update: Record<string, unknown> = { status };

        if (deliverables !== undefined) {
            update.deliverables = deliverables;
        }
        if (status === "submitted") {
            update.submittedAt = Date.now();
        }
        if (status === "approved") {
            update.approvedAt = Date.now();
        }

        await ctx.db.patch(milestoneId, update);
        return milestoneId;
    },
});