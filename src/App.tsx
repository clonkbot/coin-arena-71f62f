import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id, Doc } from "../convex/_generated/dataModel";

type Coin = Doc<"coins">;
type Battle = Doc<"battles"> & {
  coin1: Coin | null;
  coin2: Coin | null;
};

// Auth Component
function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", flow);
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAyYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0iIzIyMiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 rotate-3">
              <span className="text-2xl font-black text-white">VS</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            COIN<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">ARENA</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Battle. Vote. Dominate.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 uppercase tracking-wider"
            >
              {loading ? "Loading..." : flow === "signIn" ? "Enter Arena" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              {flow === "signIn" ? "Need an account? " : "Already have an account? "}
              <span className="text-amber-500 font-semibold">{flow === "signIn" ? "Sign Up" : "Sign In"}</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#12121a] text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="w-full bg-white/5 border border-white/10 text-gray-300 font-semibold py-4 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

// Battle Card Component
function BattleCard({ battle, onVote }: {
  battle: Battle;
  onVote: (battleId: Id<"battles">, coinId: Id<"coins">) => void
}) {
  const userVote = useQuery(api.battles.getUserVote, { battleId: battle._id });
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = battle.endsAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft("ENDED");
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [battle.endsAt]);

  const coin1 = battle.coin1;
  const coin2 = battle.coin2;

  if (!coin1 || !coin2) return null;

  const totalVotes = battle.coin1Votes + battle.coin2Votes;
  const coin1Percent = totalVotes > 0 ? (battle.coin1Votes / totalVotes) * 100 : 50;
  const coin2Percent = totalVotes > 0 ? (battle.coin2Votes / totalVotes) * 100 : 50;

  const hasVoted = userVote !== null && userVote !== undefined;
  const votedFor = userVote?.coinId;

  return (
    <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 hover:border-amber-500/30 transition-all duration-500 group">
      {/* Timer */}
      <div className="flex justify-center mb-4 md:mb-6">
        <div className="bg-black/50 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${timeLeft === "ENDED" ? "bg-red-500" : "bg-green-500 animate-pulse"}`} />
          <span className="text-white font-mono font-bold text-sm">{timeLeft}</span>
        </div>
      </div>

      {/* VS Battle */}
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {/* Coin 1 */}
        <button
          onClick={() => !hasVoted && onVote(battle._id, coin1._id)}
          disabled={hasVoted}
          className={`flex-1 p-3 md:p-4 rounded-2xl transition-all duration-300 ${
            votedFor === coin1._id
              ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500"
              : hasVoted
              ? "bg-white/5 opacity-50"
              : "bg-white/5 hover:bg-white/10 border-2 border-transparent hover:border-amber-500/50"
          }`}
        >
          <img
            src={coin1.imageUrl}
            alt={coin1.symbol}
            className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${coin1.symbol}&background=f59e0b&color=fff&size=64`;
            }}
          />
          <h3 className="text-white font-bold text-base md:text-lg">{coin1.symbol}</h3>
          <p className="text-gray-500 text-xs md:text-sm truncate">{coin1.name}</p>
          <p className={`text-xs md:text-sm font-semibold mt-1 ${coin1.priceChange24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {coin1.priceChange24h >= 0 ? "+" : ""}{coin1.priceChange24h.toFixed(1)}%
          </p>
        </button>

        {/* VS Divider */}
        <div className="flex flex-col items-center gap-1 md:gap-2 flex-shrink-0">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white font-black text-xs md:text-sm">VS</span>
          </div>
        </div>

        {/* Coin 2 */}
        <button
          onClick={() => !hasVoted && onVote(battle._id, coin2._id)}
          disabled={hasVoted}
          className={`flex-1 p-3 md:p-4 rounded-2xl transition-all duration-300 ${
            votedFor === coin2._id
              ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500"
              : hasVoted
              ? "bg-white/5 opacity-50"
              : "bg-white/5 hover:bg-white/10 border-2 border-transparent hover:border-amber-500/50"
          }`}
        >
          <img
            src={coin2.imageUrl}
            alt={coin2.symbol}
            className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${coin2.symbol}&background=f59e0b&color=fff&size=64`;
            }}
          />
          <h3 className="text-white font-bold text-base md:text-lg">{coin2.symbol}</h3>
          <p className="text-gray-500 text-xs md:text-sm truncate">{coin2.name}</p>
          <p className={`text-xs md:text-sm font-semibold mt-1 ${coin2.priceChange24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {coin2.priceChange24h >= 0 ? "+" : ""}{coin2.priceChange24h.toFixed(1)}%
          </p>
        </button>
      </div>

      {/* Vote Bar */}
      <div className="mt-4 md:mt-6">
        <div className="flex justify-between text-xs md:text-sm mb-2">
          <span className="text-amber-400 font-bold">{coin1Percent.toFixed(0)}%</span>
          <span className="text-gray-500">{totalVotes} votes</span>
          <span className="text-red-400 font-bold">{coin2Percent.toFixed(0)}%</span>
        </div>
        <div className="h-2 md:h-3 bg-white/10 rounded-full overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
            style={{ width: `${coin1Percent}%` }}
          />
          <div
            className="bg-gradient-to-r from-orange-600 to-red-500 transition-all duration-500"
            style={{ width: `${coin2Percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Leaderboard Component
function Leaderboard() {
  const coinLeaderboard = useQuery(api.coins.getLeaderboard);
  const userLeaderboard = useQuery(api.leaderboard.getTopUsers);
  const [activeTab, setActiveTab] = useState<"coins" | "users">("coins");

  return (
    <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6">
      <div className="flex gap-2 mb-4 md:mb-6">
        <button
          onClick={() => setActiveTab("coins")}
          className={`flex-1 py-2 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all ${
            activeTab === "coins"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Top Coins
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-2 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all ${
            activeTab === "users"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Top Traders
        </button>
      </div>

      {activeTab === "coins" && coinLeaderboard && (
        <div className="space-y-2 md:space-y-3">
          {coinLeaderboard.map((coin: Coin & { winRate: number }, index: number) => (
            <div
              key={coin._id}
              className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm ${
                index === 0 ? "bg-amber-500 text-black" :
                index === 1 ? "bg-gray-300 text-black" :
                index === 2 ? "bg-amber-700 text-white" :
                "bg-white/10 text-gray-400"
              }`}>
                {index + 1}
              </div>
              <img
                src={coin.imageUrl}
                alt={coin.symbol}
                className="w-8 h-8 md:w-10 md:h-10"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=f59e0b&color=fff&size=40`;
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm md:text-base">{coin.symbol}</h4>
                <p className="text-gray-500 text-xs truncate">{coin.totalVotes.toLocaleString()} votes</p>
              </div>
              <div className="text-right">
                <p className="text-amber-400 font-bold text-sm md:text-base">{coin.wins}W</p>
                <p className="text-gray-500 text-xs">{coin.losses}L</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "users" && userLeaderboard && (
        <div className="space-y-2 md:space-y-3">
          {userLeaderboard.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No traders yet. Be the first!</p>
          ) : (
            userLeaderboard.map((user: Doc<"userStats">, index: number) => (
              <div
                key={user._id}
                className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm ${
                  index === 0 ? "bg-amber-500 text-black" :
                  index === 1 ? "bg-gray-300 text-black" :
                  index === 2 ? "bg-amber-700 text-white" :
                  "bg-white/10 text-gray-400"
                }`}>
                  {index + 1}
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs md:text-sm">{user.username.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-sm md:text-base truncate">{user.username}</h4>
                  <p className="text-gray-500 text-xs">{user.totalVotes} votes</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-bold text-sm md:text-base">{user.points.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">points</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Main Dashboard
function Dashboard() {
  const { signOut } = useAuthActions();
  const battles = useQuery(api.battles.getActive);
  const userStats = useQuery(api.leaderboard.getCurrentUserStats);
  const vote = useMutation(api.battles.vote);
  const createBattle = useMutation(api.battles.createBattle);
  const seedCoins = useMutation(api.coins.seedCoins);

  useEffect(() => {
    seedCoins();
  }, []);

  const handleVote = async (battleId: Id<"battles">, coinId: Id<"coins">) => {
    try {
      await vote({ battleId, coinId });
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAyYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0iIzIyMiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 rotate-3">
              <span className="text-lg md:text-xl font-black text-white">VS</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              COIN<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">ARENA</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {userStats && (
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2">
                <span className="text-amber-400 font-bold text-sm md:text-base">{userStats.points.toLocaleString()}</span>
                <span className="text-gray-500 text-xs md:text-sm">pts</span>
              </div>
            )}
            <button
              onClick={() => signOut()}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 md:px-4 py-2 rounded-xl font-semibold transition-all text-sm md:text-base"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Battles Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">Active Battles</h2>
                <p className="text-gray-500 mt-1">Vote for your favorite coin</p>
              </div>
              <button
                onClick={() => createBattle()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-4 md:px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm md:text-base"
              >
                + New Battle
              </button>
            </div>

            {battles === undefined ? (
              <div className="space-y-4 md:space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-[#12121a]/80 border border-white/10 rounded-3xl p-6 animate-pulse">
                    <div className="h-32 md:h-40 bg-white/5 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : battles.length === 0 ? (
              <div className="bg-[#12121a]/80 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl md:text-4xl">⚔️</span>
                </div>
                <h3 className="text-white text-lg md:text-xl font-bold mb-2">No Active Battles</h3>
                <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">Start a new battle to get the arena going!</p>
                <button
                  onClick={() => createBattle()}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-6 md:px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm md:text-base"
                >
                  Create Battle
                </button>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {battles.map((battle: Battle) => (
                  <BattleCard
                    key={battle._id}
                    battle={battle}
                    onVote={handleVote}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">Leaderboard</h2>
              <p className="text-gray-500 mt-1">Top performers</p>
            </div>
            <Leaderboard />

            {/* User Stats Card */}
            {userStats && (
              <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-3xl p-4 md:p-6">
                <h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">Your Stats</h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-2xl md:text-3xl font-black text-amber-400">{userStats.points.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs md:text-sm">Points</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-2xl md:text-3xl font-black text-green-400">{userStats.correctPredictions}</p>
                    <p className="text-gray-500 text-xs md:text-sm">Correct</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-2xl md:text-3xl font-black text-white">{userStats.totalVotes}</p>
                    <p className="text-gray-500 text-xs md:text-sm">Total Votes</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-2xl md:text-3xl font-black text-orange-400">{userStats.streak}</p>
                    <p className="text-gray-500 text-xs md:text-sm">Streak</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-xs">
            Requested by <span className="text-gray-500">@web-user</span> · Built by <span className="text-gray-500">@clonkbot</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Main App Component
export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse mx-auto mb-4">
            <span className="text-2xl font-black text-white">VS</span>
          </div>
          <p className="text-gray-500">Loading arena...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <Dashboard />;
}
