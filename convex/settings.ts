import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Fungsi yang dipertahankan di settings.ts karena unik dan tidak ada duplikatnya:
// - updateAvatar: patch image di tabel users
// - updatePassword: stub validasi password

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
        // TODO: implementasi validasi + hashing password via authAdapter
        return { success: true };
    },
});

// DIHAPUS (duplikat):
// - getBankAccounts  → gunakan api.bankAccounts.getByUser
// - addBankAccount   → gunakan api.bankAccounts.create
// - get              → gunakan api.userSettings.getByUser
// - update           → gunakan api.userSettings.upsert