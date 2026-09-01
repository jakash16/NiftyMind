import React from 'react';
import { Activity, TrendingUp, TrendingDown, ShieldAlert, Zap } from 'lucide-react';
import { StockData } from '../types';

interface MarketTickerProps {
  stocks: StockData[];
  onSelectStock: (ticker: string) => void;
  activeTicker: string;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({
  stocks,
  onSelectStock,
  activeTicker,
}) => {
  const indexTicks = [
    { name: 'NIFTY 50', value: '24,385.20', change: '+142.60', changePct: '+0.59%', isUp: true },
    { name: 'BANK NIFTY', value: '52,140.80', change: '-85.10', changePct: '-0.16%', isUp: false },
    { name: 'INDIA VIX', value: '12.85', change: '-0.45', changePct: '-3.38%', isUp: false, note: 'Low Risk' },
    { name: 'SENSEX', value: '80,120.40', change: '+410.20', changePct: '+0.51%', isUp: true }
  ];

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs py-2 px-4 overflow-x-auto shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-[760px]">
        
        {/* Market Status Pulse */}
        <div className="flex items-center gap-2 shrink-0 border-r border-slate-700 pr-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wider text-[11px] text-emerald-400 uppercase">NSE LIVE FEED</span>
          <span className="text-[10px] text-slate-400 font-mono">2026</span>
        </div>

        {/* Index Highlights */}
        <div className="flex items-center gap-4 shrink-0">
          {indexTicks.map((idx) => (
            <div key={idx.name} className="flex items-center gap-1.5 font-mono">
              <span className="font-sans font-semibold text-slate-300 text-[11px]">{idx.name}:</span>
              <span className="font-bold text-white text-[11px]">{idx.value}</span>
              <span
                className={`flex items-center font-bold text-[10px] px-1 py-0.5 rounded ${
                  idx.isUp ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                }`}
              >
                {idx.isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />}
                {idx.changePct}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Stock Selector Ticker */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick Switch:</span>
          {stocks.map((stock) => {
            const isSelected = stock.ticker === activeTicker;
            return (
              <button
                key={stock.ticker}
                onClick={() => onSelectStock(stock.ticker)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                }`}
              >
                <span>{stock.ticker}</span>
                <span className={stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
