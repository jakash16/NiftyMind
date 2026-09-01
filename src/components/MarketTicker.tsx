import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
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
    { name: 'NIFTY 50', value: '24,385.20', changePct: '+0.59%', isUp: true },
    { name: 'BANK NIFTY', value: '52,140.80', changePct: '-0.16%', isUp: false },
    { name: 'INDIA VIX', value: '12.85', changePct: '-3.38%', isUp: false },
    { name: 'SENSEX', value: '80,120.40', changePct: '+0.51%', isUp: true }
  ];

  return (
    <div className="bg-[#07070A] text-neutral-300 border-b border-white/5 text-xs py-1.5 px-4 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-[760px]">
        
        {/* Market Status Pulse */}
        <div className="flex items-center gap-2 shrink-0 border-r border-white/10 pr-4">
          <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          <span className="font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
            NSE FEED ONLINE
          </span>
        </div>

        {/* Index Highlights */}
        <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
          {indexTicks.map((idx) => (
            <div key={idx.name} className="flex items-center gap-1.5">
              <span className="text-neutral-500 font-medium">{idx.name}:</span>
              <span className="font-semibold text-white">{idx.value}</span>
              <span
                className={`flex items-center font-medium text-[10px] px-1 py-0.2 rounded ${
                  idx.isUp ? 'text-emerald-400 bg-emerald-950/30' : 'text-rose-400 bg-rose-950/30'
                }`}
              >
                {idx.isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />}
                {idx.changePct}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Stock Selector Ticker */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider shrink-0 mr-1">Watchlist:</span>
          {stocks.map((stock) => {
            const isSelected = stock.ticker === activeTicker;
            return (
              <button
                key={stock.ticker}
                onClick={() => onSelectStock(stock.ticker)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-black font-semibold'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <span>{stock.ticker}</span>
                <span className={isSelected ? 'text-neutral-700' : stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
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
