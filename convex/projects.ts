import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

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

// BYOC: ambil proyek milik talent yang berasal dari undangan BYOC
export const getByocInvites = query({
    args: { talentId: v.id("users") },
    handler: async (ctx, { talentId }) => {
        return await ctx.db
            .query("projects")
            .filter((q) => q.and(q.eq(q.field("talentId"), talentId), q.eq(q.field("isByoc"), true)))
            .collect();
    },
});

// Proyek milik klien dengan filter status & search opsional
export const getByClientWithFilter = query({
    args: {
        clientId: v.id("users"),
        status: v.optional(v.string()),
        search: v.optional(v.string()),
    },
    handler: async (ctx, { clientId, status, search }) => {
        let projects = await ctx.db
            .query("projects")
            .withIndex("clientId", (q) => q.eq("clientId", clientId))
            .collect();

        if (status && status !== "all") {
            projects = projects.filter((p) => p.status === status);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            projects = projects.filter((p) =>
                p.title.toLowerCase().includes(searchLower)
            );
        }

        return projects;
    },
});

// Proyek aktif talent beserta milestones-nya — dipakai di dashboard talent
export const getByTalentWithMilestones = query({
    args: { talentId: v.id("users") },
    handler: async (ctx, { talentId }) => {
        const projects = await ctx.db
            .query("projects")
            .withIndex("talentId", (q) => q.eq("talentId", talentId))
            .filter((q) => q.eq(q.field("status"), "active"))
            .collect();

        const projectsWithMilestones = await Promise.all(
            projects.map(async (project) => {
                const milestones = await ctx.db
                    .query("milestones")
                    .withIndex("projectId", (q) => q.eq("projectId", project._id))
                    .collect();
                return { ...project, milestones };
            })
        );

        return projectsWithMilestones;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        category: v.string(),
        budget: v.number(),
        currency: v.string(),
        clientId: v.id("users"),
        clientName: v.string(),
        clientAvatar: v.optional(v.string()),
        deadline: v.number(),
        milestones: v.array(
            v.object({
                title: v.string(),
                description: v.string(),
                amount: v.number(),
                deadline: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const projectId = await ctx.db.insert("projects", {
            ...args,
            status: "draft",
            escrowStatus: "pending_deposit",
            isByoc: false,
            createdAt: Date.now(),
        });

        for (const m of args.milestones) {
            await ctx.db.insert("milestones", {
                ...m,
                projectId,
                status: "pending",
            });
        }

        return projectId;
    },
});

export const updateStatus = mutation({
    args: {
        projectId: v.id("projects"),
        status: v.union(
            v.literal("draft"),
            v.literal("open"),
            v.literal("active"),
            v.literal("completed"),
            v.literal("disputed"),
            v.literal("cancelled")
        ),
    },
    handler: async (ctx, { projectId, status }) => {
        await ctx.db.patch(projectId, { status });
        return projectId;
    },
});

// Talent melamar / mengambil proyek yang berstatus "open"
export const applyToProject = mutation({
    args: {
        projectId: v.id("projects"),
        talentId: v.id("users"),
        talentName: v.string(),
        talentAvatar: v.optional(v.string()),
    },
    handler: async (ctx, { projectId, talentId, talentName, talentAvatar }) => {
        const project = await ctx.db.get(projectId);
        if (!project) throw new Error("Proyek tidak ditemukan");
        if (project.status !== "open") throw new Error("Proyek sudah tidak tersedia");

        await ctx.db.patch(projectId, {
            talentId,
            talentName,
            talentAvatar,
            status: "active",
        });

        return projectId;
    },
});