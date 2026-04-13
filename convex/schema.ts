import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Coins that can battle in the arena
  coins: defineTable({
    symbol: v.string(),
    name: v.string(),
    imageUrl: v.string(),
    currentPrice: v.number(),
    priceChange24h: v.number(),
    marketCap: v.number(),
    totalVotes: v.number(),
    wins: v.number(),
    losses: v.number(),
    createdAt: v.number(),
  }).index("by_symbol", ["symbol"])
    .index("by_votes", ["totalVotes"])
    .index("by_wins", ["wins"]),

  // Active battles between two coins
  battles: defineTable({
    coin1Id: v.id("coins"),
    coin2Id: v.id("coins"),
    coin1Votes: v.number(),
    coin2Votes: v.number(),
    status: v.union(v.literal("active"), v.literal("completed")),
    winnerId: v.optional(v.id("coins")),
    endsAt: v.number(),
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_end_time", ["endsAt"]),

  // User votes on battles
  votes: defineTable({
    battleId: v.id("battles"),
    userId: v.id("users"),
    coinId: v.id("coins"),
    createdAt: v.number(),
  }).index("by_battle", ["battleId"])
    .index("by_user", ["userId"])
    .index("by_battle_and_user", ["battleId", "userId"]),

  // User stats for leaderboard
  userStats: defineTable({
    userId: v.id("users"),
    username: v.string(),
    correctPredictions: v.number(),
    totalVotes: v.number(),
    streak: v.number(),
    points: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_points", ["points"]),
});
