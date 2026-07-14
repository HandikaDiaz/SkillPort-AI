import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("notifications")
            .withIndex("userIdCreatedAt", (q) => q.eq("userId", userId))
            .order("desc")
            .take(20);
    },
});