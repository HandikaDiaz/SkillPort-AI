import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const settings = await ctx.db
            .query("userSettings")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .unique();

        if (!settings) {
            return {
                userId,
                displayName: "",
                title: "",
                bio: "",
                location: "",
                languages: [],
                hourlyRate: 0,
                projectRate: 0,
                skills: [],
                githubUrl: "",
                behanceUrl: "",
                dribbbleUrl: "",
                projectTypes: [],
                minBudget: 0,
                maxBudget: 0,
                preferredRegions: [],
                availability: [],
                notifyMilestoneApproved: true,
                notifyPaymentReceived: true,
                notifyByocInvite: true,
                notifyDeadlineReminder: true,
                notifyWeeklySummary: false,
                updatedAt: Date.now(),
            };
        }

        return settings;
    },
});

export const update = mutation({
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
        const { userId, ...updates } = args;

        const existing = await ctx.db
            .query("userSettings")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                ...updates,
                updatedAt: Date.now(),
            });
            return existing._id;
        } else {
            return await ctx.db.insert("userSettings", {
                ...updates,
                userId,
                updatedAt: Date.now(),
            });
        }
    },
});

export const updateAvatar = mutation({
    args: {
        userId: v.id("users"),
        image: v.string(),
    },
    handler: async (ctx, { userId, image }) => {
        await ctx.db.patch(userId, { image });
        return userId;
    },
});

export const updatePassword = mutation({
    args: {
        userId: v.id("users"),
        currentPassword: v.string(),
        newPassword: v.string(),
    },
    handler: async (ctx, { userId, currentPassword, newPassword }) => {
        // Note: Ini perlu validasi password via adapter, 
        return { success: true };
    },
});

export const getBankAccounts = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("bankAccounts")
            .withIndex("userId", (q) => q.eq("userId", userId))
            .collect();
    },
});

export const addBankAccount = mutation({
    args: {
        userId: v.id("users"),
        bankName: v.string(),
        accountNumber: v.string(),
        accountHolder: v.string(),
        isDefault: v.boolean(),
    },
    handler: async (ctx, args) => {
        if (args.isDefault) {
            const existing = await ctx.db
                .query("bankAccounts")
                .withIndex("userId", (q) => q.eq("userId", args.userId))
                .collect();

            for (const acc of existing) {
                if (acc.isDefault) {
                    await ctx.db.patch(acc._id, { isDefault: false });
                }
            }
        }

        return await ctx.db.insert("bankAccounts", {
            ...args,
            createdAt: Date.now(),
        });
    },
});