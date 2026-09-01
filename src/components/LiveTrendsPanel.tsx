import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  BarChart3, 
  Globe, 
  Sparkles, 
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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs mb-8">
      
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Live Market & Google Search Trends
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
              Real-Time Feed
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Institutional FII Inflows & Google Search Momentum
          </h3>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('sectors')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'sectors' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sector & FII Flows
          </button>
          <button
            onClick={() => setActiveTab('google_trends')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'google_trends' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Search className="w-3 h-3 text-indigo-600" />
            <span>Google Search Leaderboard</span>
          </button>
        </div>
      </div>

      {activeTab === 'sectors' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sector Heatmap Grid */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Sector Performance Matrix
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTOR_TRENDS.map((sector) => {
                const isUp = sector.changePct >= 0;
                return (
                  <div
                    key={sector.sector}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isUp ? 'bg-emerald-50/50 border-emerald-200/80' : 'bg-rose-50/50 border-rose-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {sector.sector}
                      </span>
                      <span
                        className={`text-xs font-mono font-extrabold flex items-center ${
                          isUp ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                        {isUp ? '+' : ''}{sector.changePct.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/50">
                      <span>Leader:</span>
                      <button
                        onClick={() => {
                          const tickerMatch = sector.topStock.split(' ')[0];
                          if (tickerMatch) onSelectStockByTicker(tickerMatch);
                        }}
                        className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5"
                      >
                        {sector.topStock}
                        <ArrowRight className="w-2.5 h-2.5" />
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
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-purple-600" />
                Institutional FII / DII Net Flows (₹ Crores)
              </h4>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Net Accumulation
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FII_DII_FLOW_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                    formatter={(value: any, name: any) => [`₹${value} Cr`, name === 'fii' ? 'Foreign (FII)' : 'Domestic (DII)']}
                  />
                  <Bar dataKey="fii" fill="#4f46e5" name="fii" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="dii" fill="#10b981" name="dii" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span>Foreign Institutional (FII)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Domestic Institutional (DII)</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Google Trends Live Leaderboard */
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_STOCKS.map((stock) => {
              const gt = stock.googleTrends;
              if (!gt) return null;
              return (
                <div
                  key={stock.ticker}
                  onClick={() => onSelectStockByTicker(stock.ticker)}
                  className="bg-slate-50 hover:bg-indigo-50/40 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">{stock.ticker}</span>
                      <span className="text-[11px] text-slate-500 truncate block max-w-[150px]">{stock.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-slate-900 font-mono">
                        {gt.searchScore}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block">Search Index</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${gt.searchScore}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-600 font-medium mb-2 truncate">
                    🔥 Top: <strong className="text-slate-800 font-semibold">{gt.breakoutQueries[0]?.query || 'Quarterly update'}</strong>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60">
                    <span className="text-emerald-700 font-bold font-mono">
                      {gt.breakoutQueries[0]?.growth || '+120%'} growth
                    </span>
                    <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                      Analyze <ArrowRight className="w-3 h-3" />
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
