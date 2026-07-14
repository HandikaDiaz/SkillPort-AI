import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByTalent = query({
    args: { talentId: v.id("users") },
    handler: async (ctx, { talentId }) => {
        return await ctx.db
            .query("byocInvites")
            .withIndex("talentId", (q) => q.eq("talentId", talentId))
            .order("desc")
            .take(50);
    },
});

export const create = mutation({
    args: {
        talentId: v.id("users"),
        clientName: v.string(),
        clientEmail: v.string(),
        projectName: v.string(),
        budget: v.number(),
        currency: v.string(),
        milestoneCount: v.number(),
        message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("byocInvites", {
            ...args,
            status: "sent",
            sentAt: Date.now(),
        });
    },
});

export const updateStatus = mutation({
    args: {
        inviteId: v.id("byocInvites"),
        status: v.union(
            v.literal("pending"),
            v.literal("sent"),
            v.literal("accepted"),
            v.literal("active"),
            v.literal("declined"),
        ),
        projectId: v.optional(v.id("projects")),
    },
    handler: async (ctx, { inviteId, status, projectId }) => {
        const update: any = { status };
        if (status === "active") {
            update.acceptedAt = Date.now();
        }
        if (projectId) {
            update.projectId = projectId;
        }
        await ctx.db.patch(inviteId, update);
    },
});