import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const battles = await ctx.db
      .query("battles")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const battlesWithCoins = await Promise.all(
      battles.map(async (battle) => {
        const coin1 = await ctx.db.get(battle.coin1Id);
        const coin2 = await ctx.db.get(battle.coin2Id);
        return { ...battle, coin1, coin2 };
      })
    );

    return battlesWithCoins;
  },
});

export const createBattle = mutation({
  args: {},
  handler: async (ctx) => {
    const coins = await ctx.db.query("coins").collect();
    if (coins.length < 2) return null;

    // Check for existing active battles
    const activeBattles = await ctx.db
      .query("battles")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    if (activeBattles.length >= 3) return null;

    // Pick two random coins
    const shuffled = coins.sort(() => Math.random() - 0.5);
    const coin1 = shuffled[0];
    const coin2 = shuffled[1];

    const battleId = await ctx.db.insert("battles", {
      coin1Id: coin1._id,
      coin2Id: coin2._id,
      coin1Votes: 0,
      coin2Votes: 0,
      status: "active",
      endsAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      createdAt: Date.now(),
    });

    return battleId;
  },
});

export const vote = mutation({
  args: {
    battleId: v.id("battles"),
    coinId: v.id("coins")
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const battle = await ctx.db.get(args.battleId);
    if (!battle || battle.status !== "active") {
      throw new Error("Battle not found or already ended");
    }

    // Check if user already voted
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_battle_and_user", (q) =>
        q.eq("battleId", args.battleId).eq("userId", userId)
      )
      .first();

    if (existingVote) {
      throw new Error("Already voted in this battle");
    }

    // Record vote
    await ctx.db.insert("votes", {
      battleId: args.battleId,
      userId,
      coinId: args.coinId,
      createdAt: Date.now(),
    });

    // Update battle votes
    if (args.coinId === battle.coin1Id) {
      await ctx.db.patch(args.battleId, {
        coin1Votes: battle.coin1Votes + 1
      });
    } else {
      await ctx.db.patch(args.battleId, {
        coin2Votes: battle.coin2Votes + 1
      });
    }

    // Update coin total votes
    const coin = await ctx.db.get(args.coinId);
    if (coin) {
      await ctx.db.patch(args.coinId, {
        totalVotes: coin.totalVotes + 1
      });
    }

    // Update user stats
    let userStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userStats) {
      await ctx.db.insert("userStats", {
        userId,
        username: `Trader_${userId.slice(-6)}`,
        correctPredictions: 0,
        totalVotes: 1,
        streak: 0,
        points: 10,
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.patch(userStats._id, {
        totalVotes: userStats.totalVotes + 1,
        points: userStats.points + 10,
      });
    }

    return true;
  },
});

export const getUserVote = query({
  args: { battleId: v.id("battles") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("votes")
      .withIndex("by_battle_and_user", (q) =>
        q.eq("battleId", args.battleId).eq("userId", userId)
      )
      .first();
  },
});

export const endBattle = mutation({
  args: { battleId: v.id("battles") },
  handler: async (ctx, args) => {
    const battle = await ctx.db.get(args.battleId);
    if (!battle || battle.status !== "active") return;

    const winnerId = battle.coin1Votes >= battle.coin2Votes
      ? battle.coin1Id
      : battle.coin2Id;
    const loserId = battle.coin1Votes >= battle.coin2Votes
      ? battle.coin2Id
      : battle.coin1Id;

    await ctx.db.patch(args.battleId, {
      status: "completed",
      winnerId,
    });

    // Update coin win/loss records
    const winner = await ctx.db.get(winnerId);
    const loser = await ctx.db.get(loserId);

    if (winner) {
      await ctx.db.patch(winnerId, { wins: winner.wins + 1 });
    }
    if (loser) {
      await ctx.db.patch(loserId, { losses: loser.losses + 1 });
    }

    // Update user stats for correct predictions
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_battle", (q) => q.eq("battleId", args.battleId))
      .collect();

    for (const vote of votes) {
      const userStats = await ctx.db
        .query("userStats")
        .withIndex("by_user", (q) => q.eq("userId", vote.userId))
        .first();

      if (userStats && vote.coinId === winnerId) {
        await ctx.db.patch(userStats._id, {
          correctPredictions: userStats.correctPredictions + 1,
          streak: userStats.streak + 1,
          points: userStats.points + 50,
        });
      } else if (userStats) {
        await ctx.db.patch(userStats._id, { streak: 0 });
      }
    }
  },
});
