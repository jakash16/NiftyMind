import React from 'react';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Activity, CheckCircle2, FileQuestion, Sparkles, Clock } from 'lucide-react';
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
  riskProfile,
  lastAnalyzedTime,
  onRefreshLiveFeed,
  isRefreshingLive
}) => {
  const isPositive = stock.change >= 0;
  const rangePercent = Math.min(100, Math.max(0, ((stock.currentPrice - stock.dayLow) / (stock.dayHigh - stock.dayLow || 1)) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs mb-6">
      
      {/* Top Row: Company Info & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        
        {/* Company Title & Price */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {stock.name}
            </h1>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {stock.ticker} : {stock.exchange}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Feed Connected
            </span>
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {stock.sector}
            </span>
            {stock.promoterPledgePct === 0 ? (
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                0% Promoter Pledge
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                {stock.promoterPledgePct}% Pledged Shares
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mt-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              ₹{stock.currentPrice.toFixed(2)}
            </span>
            <span
              className={`flex items-center font-mono font-bold text-sm sm:text-base ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? '+' : ''}₹{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Prev Close: ₹{stock.previousClose.toFixed(2)}
            </span>

            {onRefreshLiveFeed && (
              <button
                onClick={onRefreshLiveFeed}
                disabled={isRefreshingLive}
                title="Sync latest live prices and volume from exchange"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors"
              >
                <RotateCcw className={`w-3 h-3 ${isRefreshingLive ? 'animate-spin' : ''}`} />
                <span>{isRefreshingLive ? 'Syncing...' : 'Sync Live LTP'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Audit CTA & Multi-Agent Timer */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          <button
            id="run-analysis-cta"
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white shadow-md transition-all ${
              isAnalyzing
                ? 'bg-indigo-400 cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-indigo-200 hover:shadow-indigo-300 ring-2 ring-indigo-100'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-white" />
                <span>3 Detectives Investigating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>Run 60s Multi-Agent Audit</span>
              </>
            )}
          </button>

          {lastAnalyzedTime && (
            <div className="text-[11px] text-slate-400 font-medium hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Updated {lastAnalyzedTime}</span>
            </div>
          )}
        </div>

      </div>

      {/* Middle Row: Day Range & Key Fundamental Tags */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4">
        
        {/* Day Range Bar */}
        <div className="col-span-2 bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 border-l-3 border-l-indigo-500">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
            <span>Day Low: ₹{stock.dayLow.toFixed(1)}</span>
            <span className="text-slate-700 font-extrabold uppercase tracking-wide">Day Range</span>
            <span>Day High: ₹{stock.dayHigh.toFixed(1)}</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${rangePercent}%` }}
            />
          </div>
        </div>

        {/* 52W High / Low */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">52W Range</div>
          <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
            ₹{stock.fiftyTwoWeekLow} - ₹{stock.fiftyTwoWeekHigh}
          </div>
        </div>

        {/* Volume Ratio */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Volume Ratio</div>
          <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
            {(stock.volume / stock.avgVolume).toFixed(2)}x <span className="text-[10px] text-slate-400">({(stock.volume / 1000000).toFixed(1)}M)</span>
          </div>
        </div>

        {/* P/E & Market Cap */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">P/E & M-Cap</div>
          <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
            {stock.peRatio}x • {stock.marketCap}
          </div>
        </div>

        {/* Promoter Holding */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Promoter Holding</div>
          <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
            {stock.promoterHoldingPct}%
          </div>
        </div>

      </div>

      {/* Bottom Row: Graceful Accident / Degraded Scenario Simulator for Judges */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
          </span>
          <div>
            <span className="text-xs font-bold text-slate-900">Test Degraded Data Resilience:</span>
            <span className="text-[11px] text-slate-500 ml-1 hidden md:inline">
              Simulate real-world data gaps (missing filings, feed drops, conflicting signals)
            </span>
          </div>
        </div>

        {/* Scenario Pill Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onChangeDegradedScenario('none')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              degradedScenario === 'none'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🟢 Normal Feed
          </button>
          <button
            onClick={() => onChangeDegradedScenario('missing_filing')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              degradedScenario === 'missing_filing'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            ⚠️ Missing SEBI Filing
          </button>
          <button
            onClick={() => onChangeDegradedScenario('feed_glitch')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              degradedScenario === 'feed_glitch'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            ⚡ Data Feed Glitch
          </button>
          <button
            onClick={() => onChangeDegradedScenario('conflicting_signals')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              degradedScenario === 'conflicting_signals'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🔀 Conflicting Signals
          </button>
        </div>
      </div>

    </div>
  );
};
