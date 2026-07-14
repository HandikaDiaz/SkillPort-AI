import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userSchema = {
    email: v.string(),
    name: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
    image: v.optional(v.string()),
    role: v.optional(v.union(v.literal("client"), v.literal("talent"))),
};

export const sessionSchema = {
    userId: v.id("users"),
    expires: v.number(),
    sessionToken: v.string(),
};

export const accountSchema = {
    userId: v.id("users"),
    type: v.union(
        v.literal("email"),
        v.literal("oidc"),
        v.literal("oauth"),
        v.literal("webauthn"),
    ),
    provider: v.string(),
    providerAccountId: v.string(),
    refresh_token: v.optional(v.string()),
    access_token: v.optional(v.string()),
    expires_at: v.optional(v.number()),
    token_type: v.optional(v.string()),
    scope: v.optional(v.string()),
    id_token: v.optional(v.string()),
    session_state: v.optional(v.string()),
};

export const verificationTokenSchema = {
    identifier: v.string(),
    token: v.string(),
    expires: v.number(),
};

export const authenticatorSchema = {
    credentialID: v.string(),
    userId: v.id("users"),
    providerAccountId: v.string(),
    credentialPublicKey: v.string(),
    counter: v.number(),
    credentialDeviceType: v.string(),
    credentialBackedUp: v.boolean(),
    transports: v.optional(v.string()),
};

export const passwordSchema = {
    userId: v.id("users"),
    hash: v.string(),
};

export const projectSchema = {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    status: v.union(
        v.literal("draft"),
        v.literal("open"),
        v.literal("active"),
        v.literal("completed"),
        v.literal("disputed"),
        v.literal("cancelled"),
    ),
    budget: v.number(),
    currency: v.string(),
    clientId: v.id("users"),
    talentId: v.optional(v.id("users")),
    clientName: v.string(),
    clientAvatar: v.optional(v.string()),
    talentName: v.optional(v.string()),
    talentAvatar: v.optional(v.string()),
    deadline: v.number(),
    createdAt: v.number(),
    escrowStatus: v.string(),
    isByoc: v.boolean(),
};

export const milestoneSchema = {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.string(),
    amount: v.number(),
    deadline: v.number(),
    status: v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("submitted"),
        v.literal("approved"),
        v.literal("rejected"),
    ),
    deliverables: v.optional(v.array(v.string())),
    submittedAt: v.optional(v.number()),
    approvedAt: v.optional(v.number()),
};

export const notificationSchema = {
    userId: v.id("users"),
    type: v.union(
        v.literal("payment"),
        v.literal("milestone"),
        v.literal("deadline"),
        v.literal("byoc"),
        v.literal("system"),
        v.literal("dispute"),
        v.literal("credential"),
    ),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
    projectId: v.optional(v.id("projects")),
    actionUrl: v.optional(v.string()),
};

export const conversationSchema = {
    projectId: v.id("projects"),
    projectName: v.string(),
    participants: v.array(
        v.object({
            id: v.string(),
            name: v.string(),
            avatar: v.string(),
            role: v.string(),
        })
    ),
    lastMessage: v.string(),
    lastMessageAt: v.number(),
    unreadCount: v.number(),
    status: v.string(),
};

export const messageSchema = {
    conversationId: v.id("conversations"),
    senderId: v.string(),
    senderName: v.string(),
    senderAvatar: v.optional(v.string()),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("file"), v.literal("milestone_pin"), v.literal("system")),
    createdAt: v.number(),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    milestoneId: v.optional(v.string()),
    readBy: v.array(v.string()),
};

export const disputeSchema = {
    projectId: v.id("projects"),
    projectName: v.string(),
    milestoneId: v.string(),
    milestoneName: v.string(),
    filedBy: v.string(),
    filedAgainst: v.string(),
    reason: v.string(),
    description: v.string(),
    status: v.union(
        v.literal("open"),
        v.literal("under_review"),
        v.literal("resolved_client_favor"),
        v.literal("resolved_talent_favor"),
        v.literal("resolved_split"),
        v.literal("rejected"),
    ),
    createdAt: v.number(),
    resolution: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
};

export const escrowTransactionSchema = {
    projectId: v.id("projects"),
    projectName: v.string(),
    type: v.union(v.literal("deposit"), v.literal("release"), v.literal("refund")),
    amount: v.number(),
    currency: v.string(),
    status: v.union(v.literal("confirmed"), v.literal("pending"), v.literal("failed")),
    transactionHash: v.string(),
    createdAt: v.number(),
};

export const talentProfileSchema = {
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
};

const authTables = {
    users: defineTable(userSchema).index("email", ["email"]),
    sessions: defineTable(sessionSchema)
        .index("sessionToken", ["sessionToken"])
        .index("userId", ["userId"]),
    accounts: defineTable(accountSchema)
        .index("providerAndAccountId", ["provider", "providerAccountId"])
        .index("userId", ["userId"]),
    verificationTokens: defineTable(verificationTokenSchema).index(
        "identifierToken",
        ["identifier", "token"],
    ),
    authenticators: defineTable(authenticatorSchema)
        .index("userId", ["userId"])
        .index("credentialID", ["credentialID"]),
    passwords: defineTable(passwordSchema).index("userId", ["userId"]),
};

const projectTables = {
    projects: defineTable(projectSchema)
        .index("clientId", ["clientId"])
        .index("talentId", ["talentId"])
        .index("status", ["status"]),
    milestones: defineTable(milestoneSchema).index("projectId", ["projectId"]),
    notifications: defineTable(notificationSchema)
        .index("userId", ["userId"])
        .index("userIdCreatedAt", ["userId", "createdAt"]),
    conversations: defineTable(conversationSchema).index("projectId", ["projectId"]),
    messages: defineTable(messageSchema)
        .index("conversationId", ["conversationId"])
        .index("conversationIdCreatedAt", ["conversationId", "createdAt"]),
    disputes: defineTable(disputeSchema).index("projectId", ["projectId"]),
    escrowTransactions: defineTable(escrowTransactionSchema).index("projectId", ["projectId"]),
    talentProfiles: defineTable(talentProfileSchema).index("userId", ["userId"]),
};

export default defineSchema({
    ...authTables,
    ...projectTables,
});