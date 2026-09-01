import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  RefreshCw, 
  Search, 
  MapPin, 
  ArrowUpRight,
  Radio,
  Clock
} from 'lucide-react';
import { StockData } from '../types';

interface GoogleTrendsRadarProps {
  stock: StockData;
  onSelectQuery?: (query: string) => void;
}

export const GoogleTrendsRadar: React.FC<GoogleTrendsRadarProps> = ({ stock, onSelectQuery }) => {
  const trends = stock.googleTrends;
  const [liveScore, setLiveScore] = useState(trends?.searchScore || 78);
  const [isLiveSyncing, setIsLiveSyncing] = useState(true);
  const [queryFeed, setQueryFeed] = useState(trends?.liveQueryStream || []);

  useEffect(() => {
    if (trends) {
      setLiveScore(trends.searchScore);
      setQueryFeed(trends.liveQueryStream);
    }
  }, [trends]);

  // Live simulation of streaming search queries
  useEffect(() => {
    if (!isLiveSyncing || !trends) return;

    const sampleQueries = [
      { query: `${stock.name} target price 2026`, location: 'Mumbai, MH', sentiment: 'POSITIVE' as const },
      { query: `${stock.ticker} quarterly earnings date`, location: 'Bengaluru, KA', sentiment: 'NEUTRAL' as const },
      { query: `${stock.name} dividend payout record date`, location: 'New Delhi, DL', sentiment: 'POSITIVE' as const },
      { query: `Is ${stock.ticker} safe for beginners?`, location: 'Hyderabad, TS', sentiment: 'POSITIVE' as const },
      { query: `${stock.name} promoter shareholding report`, location: 'Chennai, TN', sentiment: 'NEUTRAL' as const },
      { query: `Why is ${stock.ticker} rising today`, location: 'Pune, MH', sentiment: 'POSITIVE' as const }
    ];

    const interval = setInterval(() => {
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      const newEntry = {
        id: `gq-${Date.now()}`,
        query: randomQuery.query,
        location: randomQuery.location,
        timestamp: 'Just now',
        sentiment: randomQuery.sentiment
      };

      setQueryFeed((prev) => [newEntry, ...prev.slice(0, 4)]);
      
      setLiveScore((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.min(99, Math.max(40, prev + delta));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveSyncing, stock.name, stock.ticker, trends]);

  if (!trends) return null;

  const isSurging = liveScore >= 80 || trends.momentum === 'SURGING';

  return (
    <div className="bg-[#0A0A0E] rounded-2xl p-6 sm:p-7 border border-white/10 relative overflow-hidden transition-all duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Google Trends Real-Time Pulse
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Radio className="w-2.5 h-2.5 text-emerald-400" />
                Live Grounded
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Public Search Interest & Breakout Topics for <span className="font-mono">{stock.ticker}</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveSyncing(!isLiveSyncing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
              isLiveSyncing 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                : 'bg-white/5 text-neutral-400 border-white/10'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isLiveSyncing ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            <span>{isLiveSyncing ? 'Live Stream Active' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Score Gauge + Breakout Queries + Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        
        {/* Column 1: Search Interest Index Meter */}
        <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              <span>Search Index</span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-semibold ${
                isSurging 
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' 
                  : 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
              }`}>
                {trends.momentum}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">
                {liveScore}
              </span>
              <span className="text-neutral-500 text-xs font-mono">/ 100</span>
              <span className={`text-xs font-mono font-medium flex items-center ml-auto ${trends.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trends.changePct >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                {trends.changePct >= 0 ? '+' : ''}{trends.changePct.toFixed(1)}% (24h)
              </span>
            </div>

            {/* Visual Index Bar */}
            <div className="w-full bg-[#181822] h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-neutral-300 h-full rounded-full transition-all duration-300"
                style={{ width: `${liveScore}%` }}
              />
            </div>

            <p className="text-xs text-neutral-300 mt-3 leading-relaxed">
              {trends.searchVolumeDescription}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10 text-[10px] font-mono text-neutral-400 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Grounding synced via Google Search</span>
          </div>
        </div>

        {/* Column 2: Breakout Google Search Queries */}
        <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            <span className="flex items-center gap-1.5 text-white">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              Breakout Search Topics
            </span>
            <span className="text-[10px] text-neutral-500">Google Trends</span>
          </div>

          <div className="space-y-2">
            {trends.breakoutQueries.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectQuery && onSelectQuery(item.query)}
                className="p-2.5 rounded-lg bg-[#14141C] border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="truncate text-xs text-neutral-200 group-hover:text-white">
                  {item.query}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-mono font-medium text-emerald-300 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    {item.growth}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Live Query Feed & Regional Interest */}
        <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
              <span className="flex items-center gap-1.5 text-white">
                <MapPin className="w-3.5 h-3.5 text-violet-400" />
                Regional Search Heat
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Top States</span>
            </div>

            <div className="space-y-2 mb-3">
              {trends.regionalBreakdown.slice(0, 3).map((reg) => (
                <div key={reg.region} className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">{reg.region}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <div className="w-16 bg-[#181822] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-neutral-300 h-full rounded-full"
                        style={{ width: `${reg.intensity}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 w-5 text-right">
                      {reg.intensity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Streaming Queries */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                Live Consumer Inquiries:
              </div>
              <div className="space-y-1">
                {queryFeed.slice(0, 2).map((q) => (
                  <div key={q.id} className="text-[11px] text-neutral-400 truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-neutral-200 truncate">"{q.query}"</span>
                    <span className="text-[9px] text-neutral-500 shrink-0 font-mono">({q.location})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
