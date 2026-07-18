import { v } from "convex/values";
import { query } from "./_generated/server";

// Hitung saldo escrow talent berdasarkan data nyata dari tabel wallets & escrowTransactions
export const getBalanceByTalent = query({
    args: { talentId: v.id("users") },
    handler: async (ctx, { talentId }) => {
        // Ambil wallet utama talent
        const wallet = await ctx.db
            .query("wallets")
            .withIndex("userId", (q) => q.eq("userId", talentId))
            .unique();

        if (wallet) {
            return {
                available: wallet.balance,
                locked: wallet.pendingSettlement,
                total: wallet.totalEarned,
                availableUsd: wallet.balanceUsd,
                totalUsd: wallet.totalEarnedUsd,
            };
        }

        // Fallback: hitung dari escrowTransactions jika wallet belum ada
        const transactions = await ctx.db
            .query("escrowTransactions")
            .withIndex("userId", (q) => q.eq("userId", talentId))
            .collect();

        const available = transactions
            .filter((t) => t.type === "release" && t.status === "confirmed")
            .reduce((sum, t) => sum + t.amount, 0);

        const locked = transactions
            .filter((t) => t.type === "deposit" && t.status === "confirmed")
            .reduce((sum, t) => sum + t.amount, 0);

        return { available, locked, total: available + locked, availableUsd: 0, totalUsd: 0 };
    },
});
