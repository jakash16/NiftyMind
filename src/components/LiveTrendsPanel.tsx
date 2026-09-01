import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  BarChart3, 
  Globe, 
  ArrowRight, 
  Search,
  Radio
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SECTOR_TRENDS, FII_DII_FLOW_DATA, POPULAR_STOCKS } from '../data/stocks';

interface LiveTrendsPanelProps {
  onSelectStockByTicker: (ticker: string) => void;
}

export const LiveTrendsPanel: React.FC<LiveTrendsPanelProps> = ({ onSelectStockByTicker }) => {
  const [activeTab, setActiveTab] = useState<'sectors' | 'google_trends'>('sectors');

  return (
    <div className="bg-[#0A0A0E] rounded-2xl p-6 sm:p-7 border border-white/10 relative overflow-hidden transition-all duration-200">
      
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Live Market & Search Trends
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Radio className="w-2.5 h-2.5 text-emerald-400" />
              Real-Time Feed
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
            Institutional Flows & Search Momentum
          </h3>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-[#121218] p-0.5 rounded-lg border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('sectors')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === 'sectors' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sector & FII Flows
          </button>
          <button
            onClick={() => setActiveTab('google_trends')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'google_trends' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Search className="w-3 h-3" />
            <span>Search Leaderboard</span>
          </button>
        </div>
      </div>

      {activeTab === 'sectors' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sector Heatmap Grid */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Sector Performance Matrix
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTOR_TRENDS.map((sector) => {
                const isUp = sector.changePct >= 0;
                return (
                  <div
                    key={sector.sector}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isUp 
                        ? 'bg-[#0E0E14] border-white/5 hover:border-emerald-500/30' 
                        : 'bg-[#0E0E14] border-white/5 hover:border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-white truncate">
                        {sector.sector}
                      </span>
                      <span
                        className={`text-xs font-mono font-medium flex items-center ${
                          isUp ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                        {isUp ? '+' : ''}{sector.changePct.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 pt-2 border-t border-white/5">
                      <span>Leader:</span>
                      <button
                        onClick={() => {
                          const tickerMatch = sector.topStock.split(' ')[0];
                          if (tickerMatch) onSelectStockByTicker(tickerMatch);
                        }}
                        className="font-medium text-cyan-400 hover:text-white flex items-center gap-1 transition-colors font-mono"
                      >
                        {sector.topStock}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional FII vs DII Net Purchases */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-violet-400" />
                Institutional FII / DII Flows (₹ Cr)
              </h4>
              <span className="text-[10px] font-mono font-medium text-emerald-300 bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-500/20">
                Net Accumulation
              </span>
            </div>

            <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FII_DII_FLOW_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A22" opacity={0.6} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121218',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono',
                      color: '#ffffff'
                    }}
                    formatter={(value: any, name: any) => [`₹${value} Cr`, name === 'fii' ? 'Foreign (FII)' : 'Domestic (DII)']}
                  />
                  <Bar dataKey="fii" fill="#8b5cf6" name="fii" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="dii" fill="#10b981" name="dii" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span>Foreign Institutional (FII)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Domestic Institutional (DII)</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Google Trends Live Leaderboard */
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR_STOCKS.map((stock) => {
              const gt = stock.googleTrends;
              if (!gt) return null;
              return (
                <div
                  key={stock.ticker}
                  onClick={() => onSelectStockByTicker(stock.ticker)}
                  className="bg-[#0E0E14] hover:bg-[#14141C] p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-mono font-bold text-xs text-white block group-hover:text-cyan-400 transition-colors">{stock.ticker}</span>
                      <span className="text-[11px] text-neutral-400 truncate block max-w-[150px]">{stock.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white font-mono">
                        {gt.searchScore}
                      </span>
                      <span className="text-[9px] text-neutral-500 uppercase tracking-wider block font-mono">Index</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#181822] h-1.5 rounded-full overflow-hidden mb-2.5">
                    <div
                      className="bg-neutral-300 h-full rounded-full"
                      style={{ width: `${gt.searchScore}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-neutral-300 mb-2 truncate">
                    🔥 Top: <strong className="text-white font-medium">{gt.breakoutQueries[0]?.query || 'Quarterly update'}</strong>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 font-mono">
                    <span className="text-emerald-400 font-medium">
                      {gt.breakoutQueries[0]?.growth || '+120%'}
                    </span>
                    <span className="text-neutral-400 group-hover:text-white font-medium flex items-center gap-1 transition-colors">
                      Investigate <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
