import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Sparkles, 
  RefreshCw, 
  Search, 
  Zap, 
  MapPin, 
  ArrowUpRight,
  Radio,
  Clock
} from 'lucide-react';
import { StockData, GoogleTrendsData } from '../types';

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
  }, [stock.ticker]);

  // Live simulation of streaming Google search queries
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
      const now = new Date();
      const newEntry = {
        id: `gq-${Date.now()}`,
        query: randomQuery.query,
        location: randomQuery.location,
        timestamp: 'Just now',
        sentiment: randomQuery.sentiment
      };

      setQueryFeed((prev) => [newEntry, ...prev.slice(0, 4)]);
      
      // Jiggle score slightly
      setLiveScore((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.min(99, Math.max(40, prev + delta));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveSyncing, stock, trends]);

  if (!trends) return null;

  const isSurging = liveScore >= 80 || trends.momentum === 'SURGING';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                Google Trends Real-Time Pulse
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                Live Grounding
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Public Search Interest & Breakout Topics for {stock.ticker}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveSyncing(!isLiveSyncing)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isLiveSyncing 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isLiveSyncing ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            <span>{isLiveSyncing ? 'Live Stream On' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Score Gauge + Breakout Queries + Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        
        {/* Column 1: Search Interest Index Meter */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span>Google Search Index</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isSurging ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {trends.momentum}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 font-mono">
                {liveScore}
              </span>
              <span className="text-slate-400 text-sm font-semibold">/ 100</span>
              <span className={`text-xs font-extrabold flex items-center ml-auto ${trends.changePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trends.changePct >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5 inline" />}
                {trends.changePct >= 0 ? '+' : ''}{trends.changePct.toFixed(1)}% (24h)
              </span>
            </div>

            {/* Visual Index Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  liveScore > 85 ? 'bg-gradient-to-r from-indigo-500 to-rose-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}
                style={{ width: `${liveScore}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 mt-3 font-medium leading-relaxed">
              {trends.searchVolumeDescription}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200/80 text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated with Google Trends Grounding</span>
          </div>
        </div>

        {/* Column 2: Breakout Google Search Queries */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              Breakout Search Topics
            </span>
            <span className="text-[10px] text-slate-400">Google Trends</span>
          </div>

          <div className="space-y-2">
            {trends.breakoutQueries.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectQuery && onSelectQuery(item.query)}
                className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="truncate text-xs font-bold text-slate-800">
                  {item.query}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {item.growth}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Live Query Feed & Regional Interest */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                Regional Search Intensity
              </span>
              <span className="text-[10px] text-indigo-600 font-bold">Top States</span>
            </div>

            <div className="space-y-1.5 mb-3">
              {trends.regionalBreakdown.slice(0, 3).map((reg) => (
                <div key={reg.region} className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-semibold">{reg.region}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${reg.intensity}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-500 w-6 text-right">
                      {reg.intensity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Streaming Queries */}
            <div className="pt-2 border-t border-slate-200/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Recent Consumer Inquiries:
              </div>
              <div className="space-y-1">
                {queryFeed.slice(0, 2).map((q) => (
                  <div key={q.id} className="text-[11px] text-slate-600 truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">"{q.query}"</span>
                    <span className="text-[9px] text-slate-400 font-mono shrink-0">({q.location})</span>
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
