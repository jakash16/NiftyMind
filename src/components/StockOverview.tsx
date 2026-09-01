import React from 'react';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Clock, Cpu } from 'lucide-react';
import { StockData, RiskProfileType } from '../types';

interface StockOverviewProps {
  stock: StockData;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
  degradedScenario: 'none' | 'missing_filing' | 'feed_glitch' | 'conflicting_signals';
  onChangeDegradedScenario: (scenario: 'none' | 'missing_filing' | 'feed_glitch' | 'conflicting_signals') => void;
  riskProfile: RiskProfileType;
  lastAnalyzedTime?: string;
  onRefreshLiveFeed?: () => void;
  isRefreshingLive?: boolean;
}

export const StockOverview: React.FC<StockOverviewProps> = ({
  stock,
  isAnalyzing,
  onRunAnalysis,
  degradedScenario,
  onChangeDegradedScenario,
  lastAnalyzedTime,
  onRefreshLiveFeed,
  isRefreshingLive
}) => {
  const isPositive = stock.change >= 0;
  const rangePercent = Math.min(100, Math.max(0, ((stock.currentPrice - stock.dayLow) / (stock.dayHigh - stock.dayLow || 1)) * 100));

  return (
    <div className="bg-[#0A0A0E] rounded-2xl p-6 sm:p-7 border border-white/10 relative overflow-hidden transition-all duration-200">
      
      {/* Top Row: Company Title, Exchange & Price Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {stock.name}
            </h1>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
              {stock.ticker} : {stock.exchange}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Live Feed
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
              {stock.sector}
            </span>
            {stock.promoterPledgePct === 0 ? (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                0% Pledge
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">{stock.promoterPledgePct}%</span> Pledged
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-4 mt-3 flex-wrap">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight">
              ₹{stock.currentPrice.toFixed(2)}
            </span>
            <span
              className={`flex items-center font-mono font-semibold text-sm sm:text-base px-2 py-0.5 rounded ${
                isPositive 
                  ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/20' 
                  : 'text-rose-400 bg-rose-950/40 border border-rose-500/20'
              }`}
            >
              {isPositive ? '+' : ''}₹{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline font-mono">
              Prev Close: ₹{stock.previousClose.toFixed(2)}
            </span>

            {onRefreshLiveFeed && (
              <button
                onClick={onRefreshLiveFeed}
                disabled={isRefreshingLive}
                title="Sync latest live prices from exchange"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-[#14141C] hover:bg-[#1C1C28] px-2.5 py-1 rounded border border-white/10 transition-all"
              >
                <RotateCcw className={`w-3 h-3 ${isRefreshingLive ? 'animate-spin' : ''}`} />
                <span>{isRefreshingLive ? 'Syncing...' : 'Sync LTP'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 60s Multi-Agent Audit CTA */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          <button
            id="run-analysis-cta"
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className={`px-5 py-2.5 rounded-lg font-medium text-xs transition-all flex items-center gap-2 ${
              isAnalyzing
                ? 'bg-[#181824] text-neutral-400 border border-white/10 cursor-wait'
                : 'bg-white text-black font-semibold hover:bg-neutral-200 active:scale-98'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                <span>3 Detectives Auditing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-black" />
                <span>Run Multi-Agent Audit</span>
              </>
            )}
          </button>

          {lastAnalyzedTime && (
            <div className="text-xs text-neutral-400 hidden sm:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Audited <span className="font-mono">{lastAnalyzedTime}</span></span>
            </div>
          )}
        </div>

      </div>

      {/* Middle Row: Floating Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-5">
        
        {/* Day Range Bar */}
        <div className="col-span-2 bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5 font-mono">
            <span>Low: ₹{stock.dayLow.toFixed(1)}</span>
            <span className="text-neutral-400 uppercase tracking-wider font-sans text-[10px]">Day Range</span>
            <span>High: ₹{stock.dayHigh.toFixed(1)}</span>
          </div>
          <div className="w-full bg-[#181822] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-neutral-300 h-full rounded-full transition-all duration-300"
              style={{ width: `${rangePercent}%` }}
            />
          </div>
        </div>

        {/* 52W High / Low */}
        <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">52W Range</div>
          <div className="text-xs font-semibold text-white font-mono mt-1">
            ₹{stock.fiftyTwoWeekLow} - ₹{stock.fiftyTwoWeekHigh}
          </div>
        </div>

        {/* Volume Ratio */}
        <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Volume Ratio</div>
          <div className="text-xs font-semibold text-cyan-400 font-mono mt-1">
            {(stock.volume / stock.avgVolume).toFixed(2)}x <span className="text-[10px] text-neutral-500">({(stock.volume / 1000000).toFixed(1)}M)</span>
          </div>
        </div>

        {/* P/E & Market Cap */}
        <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">P/E & M-Cap</div>
          <div className="text-xs font-semibold text-white font-mono mt-1">
            {stock.peRatio}x • {stock.marketCap}
          </div>
        </div>

        {/* Promoter Holding */}
        <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Promoter Holding</div>
          <div className="text-xs font-semibold text-emerald-400 font-mono mt-1">
            {stock.promoterHoldingPct}%
          </div>
        </div>

      </div>

      {/* Bottom Row: Fault Resilience Telemetry Bar */}
      <div className={`mt-5 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#08080C] p-3.5 rounded-xl border ${
        degradedScenario !== 'none' ? 'border-rose-500/40 animate-glitch' : 'border-white/5'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-md ${degradedScenario !== 'none' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-neutral-400'}`}>
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-white flex items-center gap-2">
              <span>Degraded Data Resilience Simulator:</span>
              {degradedScenario !== 'none' && (
                <span className="text-[10px] px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Fault Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 hidden md:block">
              Simulate network drops & missing filings to test multi-agent fallback reasoning
            </p>
          </div>
        </div>

        {/* Interactive Toggle Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onChangeDegradedScenario('none')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              degradedScenario === 'none'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            Normal Feed
          </button>
          <button
            onClick={() => onChangeDegradedScenario('missing_filing')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              degradedScenario === 'missing_filing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            Missing Filing
          </button>
          <button
            onClick={() => onChangeDegradedScenario('feed_glitch')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              degradedScenario === 'feed_glitch'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            Feed Glitch
          </button>
          <button
            onClick={() => onChangeDegradedScenario('conflicting_signals')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              degradedScenario === 'conflicting_signals'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-semibold'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            Conflicting Signals
          </button>
        </div>
      </div>

    </div>
  );
};
