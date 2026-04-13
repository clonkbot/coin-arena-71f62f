import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Sample coin data
const INITIAL_COINS = [
  { symbol: "BTC", name: "Bitcoin", imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg", currentPrice: 67420, priceChange24h: 2.4, marketCap: 1320000000000 },
  { symbol: "ETH", name: "Ethereum", imageUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.svg", currentPrice: 3520, priceChange24h: -1.2, marketCap: 423000000000 },
  { symbol: "SOL", name: "Solana", imageUrl: "https://cryptologos.cc/logos/solana-sol-logo.svg", currentPrice: 142, priceChange24h: 5.8, marketCap: 65000000000 },
  { symbol: "DOGE", name: "Dogecoin", imageUrl: "https://cryptologos.cc/logos/dogecoin-doge-logo.svg", currentPrice: 0.12, priceChange24h: 8.3, marketCap: 17000000000 },
  { symbol: "XRP", name: "Ripple", imageUrl: "https://cryptologos.cc/logos/xrp-xrp-logo.svg", currentPrice: 0.52, priceChange24h: -0.5, marketCap: 28000000000 },
  { symbol: "ADA", name: "Cardano", imageUrl: "https://cryptologos.cc/logos/cardano-ada-logo.svg", currentPrice: 0.45, priceChange24h: 3.1, marketCap: 16000000000 },
  { symbol: "AVAX", name: "Avalanche", imageUrl: "https://cryptologos.cc/logos/avalanche-avax-logo.svg", currentPrice: 35, priceChange24h: 4.2, marketCap: 14000000000 },
  { symbol: "LINK", name: "Chainlink", imageUrl: "https://cryptologos.cc/logos/chainlink-link-logo.svg", currentPrice: 14, priceChange24h: 1.8, marketCap: 8500000000 },
  { symbol: "MATIC", name: "Polygon", imageUrl: "https://cryptologos.cc/logos/polygon-matic-logo.svg", currentPrice: 0.58, priceChange24h: -2.1, marketCap: 5400000000 },
  { symbol: "SHIB", name: "Shiba Inu", imageUrl: "https://cryptologos.cc/logos/shiba-inu-shib-logo.svg", currentPrice: 0.000022, priceChange24h: 12.5, marketCap: 13000000000 },
];

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("coins").order("desc").collect();
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const coins = await ctx.db.query("coins").collect();
    return coins
      .map(coin => ({
        ...coin,
        winRate: coin.wins + coin.losses > 0
          ? (coin.wins / (coin.wins + coin.losses)) * 100
          : 0,
      }))
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 10);
  },
});

export const seedCoins = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("coins").first();
    if (existing) return;

    for (const coin of INITIAL_COINS) {
      await ctx.db.insert("coins", {
        ...coin,
        totalVotes: Math.floor(Math.random() * 10000),
        wins: Math.floor(Math.random() * 50),
        losses: Math.floor(Math.random() * 50),
        createdAt: Date.now(),
      });
    }
  },
});

export const get = query({
  args: { id: v.id("coins") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
