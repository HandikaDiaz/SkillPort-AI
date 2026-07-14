import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByProject = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, { projectId }) => {
        return await ctx.db
            .query("milestones")
            .withIndex("projectId", (q) => q.eq("projectId", projectId))
            .collect();
    },
});