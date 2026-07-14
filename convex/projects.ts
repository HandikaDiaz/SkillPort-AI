import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByClient = query({
    args: { clientId: v.id("users") },
    handler: async (ctx, { clientId }) => {
        return await ctx.db
            .query("projects")
            .withIndex("clientId", (q) => q.eq("clientId", clientId))
            .collect();
    },
});

export const getByTalent = query({
    args: { talentId: v.id("users") },
    handler: async (ctx, { talentId }) => {
        return await ctx.db
            .query("projects")
            .withIndex("talentId", (q) => q.eq("talentId", talentId))
            .collect();
    },
});

export const getOpen = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("projects")
            .withIndex("status", (q) => q.eq("status", "open"))
            .collect();
    },
});

export const getById = query({
    args: { id: v.id("projects") },
    handler: async (ctx, { id }) => {
        return await ctx.db.get(id);
    },
});

export const getByocInvites = query({
    args: { talentId: v.id("users") },
    handler: async (ctx, { talentId }) => {
        return await ctx.db
            .query("projects")
            .filter((q) => q.and(q.eq(q.field("talentId"), talentId), q.eq(q.field("isByoc"), true)))
            .collect();
    },
});