import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getTopUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("userStats").collect();
    return users
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  },
});

export const getCurrentUserStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});
