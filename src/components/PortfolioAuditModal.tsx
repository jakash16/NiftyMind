import React, { useState } from 'react';
import { 
  X, ShieldCheck, Activity, Newspaper, Sparkles, CheckCircle2, 
  AlertTriangle, ArrowUpRight, TrendingUp, TrendingDown, Scale, 
  Layers, ChevronRight, ShieldAlert, DollarSign, PieChart, RefreshCw
} from 'lucide-react';
import { PortfolioAuditResult, RiskProfileType, SignalType, UserProfile } from '../types';

interface PortfolioAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: PortfolioAuditResult | null;
  isLoading?: boolean;
  onReAudit?: () => void;
  riskProfile: RiskProfileType;
  onSelectStock: (ticker: string) => void;
  portfolioName?: string;
  userProfile?: UserProfile;
}

export const PortfolioAuditModal: React.FC<PortfolioAuditModalProps> = ({
  isOpen,
  onClose,
  auditResult,
  isLoading = false,
  onReAudit,
  riskProfile,
  onSelectStock,
  portfolioName,
  userProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detectives' | 'holdings' | 'rebalance'>('overview');

  if (!isOpen) return null;

  const displayName = portfolioName || userProfile?.name || 'Investment Portfolio';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  Autonomous 3-Agent Evaluation
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 capitalize">
                  {riskProfile} Profile
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {displayName}'s Multi-Agent Portfolio Audit
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReAudit}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Re-run assessment with live data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-2 pt-2">
          {[
            { id: 'overview', label: 'Synthesis & Verdict', icon: Sparkles },
            { id: 'detectives', label: '3 Detectives Breakdown', icon: Layers },
            { id: 'holdings', label: 'Per-Holding Actions', icon: PieChart },
            { id: 'rebalance', label: 'Rebalance Blueprint', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading || !auditResult ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              <div className="text-center">
                <p className="text-base font-extrabold text-slate-900">
                  Detectives Auditing Your Portfolio Holdings...
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Checking SEBI promoter pledges, technical RSI momentum, and institutional FII flows across all assets.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & SYNTHESIS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Boss Synthesis Card */}
                  <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold tracking-wide uppercase">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          The Boss AI Synthesizer Verdict
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black mt-1 text-white">
                          {auditResult.verdictTitle}
                        </h3>
                      </div>

                      {/* Overall Score Badge */}
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 self-start sm:self-auto">
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Health Score</div>
                          <div className="text-2xl font-black font-mono text-emerald-400">
                            {auditResult.overallScore}/100
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">
                          {auditResult.overallScore >= 75 ? 'A+' : auditResult.overallScore >= 60 ? 'B' : 'C'}
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed mt-5">
                      {auditResult.summary}
                    </p>

                    {/* Summary Quick Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[11px] text-slate-400 block font-medium">Total Value</span>
                        <span className="text-base font-black font-mono text-white mt-0.5 block">
                          ₹{auditResult.totalHoldingsValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[11px] text-slate-400 block font-medium">Unrealized P&L</span>
                        <span className={`text-base font-black font-mono mt-0.5 block ${auditResult.totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {auditResult.totalUnrealizedPnl >= 0 ? '+' : ''}₹{auditResult.totalUnrealizedPnl.toFixed(2)} ({auditResult.totalUnrealizedPnlPct >= 0 ? '+' : ''}{auditResult.totalUnrealizedPnlPct.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[11px] text-slate-400 block font-medium">Weighted RSI</span>
                        <span className="text-base font-black font-mono text-indigo-300 mt-0.5 block">
                          {auditResult.detectives.chart.portfolioRsi}
                        </span>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[11px] text-slate-400 block font-medium">Avg Promoter Pledge</span>
                        <span className="text-base font-black font-mono text-emerald-400 mt-0.5 block">
                          {auditResult.detectives.rulebook.avgPromoterPledge}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Detectives Consensus Summary Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Rulebook Detective */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900">The Rulebook Detective</h4>
                            <span className="text-[10px] text-slate-400">SEBI & Governance RAG</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          auditResult.detectives.rulebook.verdict === 'SAFE' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {auditResult.detectives.rulebook.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {auditResult.detectives.rulebook.summary}
                      </p>
                    </div>

                    {/* Chart Detective */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900">The Chart Detective</h4>
                            <span className="text-[10px] text-slate-400">Momentum & Indicators</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          auditResult.detectives.chart.verdict === 'BULLISH' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {auditResult.detectives.chart.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {auditResult.detectives.chart.summary}
                      </p>
                    </div>

                    {/* News Detective */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                            <Newspaper className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900">The News Detective</h4>
                            <span className="text-[10px] text-slate-400">Institutional FII Flows</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                          {auditResult.detectives.news.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {auditResult.detectives.news.summary}
                      </p>
                    </div>
                  </div>

                  {/* Sector Allocation Breakdown */}
                  {auditResult.sectorAllocation.length > 0 && (
                    <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                        <PieChart className="w-3.5 h-3.5" />
                        Sector Diversification Matrix
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {auditResult.sectorAllocation.map((sec) => (
                          <div key={sec.sector} className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 truncate">{sec.sector}</span>
                              <span className="font-mono font-black text-xs text-indigo-600">{sec.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${sec.riskLevel === 'HIGH' ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                                style={{ width: `${Math.min(100, sec.percentage)}%` }} 
                              />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
                              <span>₹{sec.value.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                              <span className={sec.riskLevel === 'HIGH' ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                                {sec.riskLevel === 'HIGH' ? 'Over-concentrated' : 'Healthy Allocation'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: 3 DETECTIVES BREAKDOWN */}
              {activeTab === 'detectives' && (
                <div className="space-y-6">
                  {/* Detective 1: Rulebook */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900">Robot 2: The Rulebook Detective</h3>
                          <p className="text-xs text-slate-500">SEBI Regulatory Filings, Promoter Pledges & Balance Sheet Debt</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-semibold block">Compliance Score</span>
                        <span className="text-xl font-black font-mono text-indigo-700">
                          {auditResult.detectives.rulebook.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <p className="text-xs text-slate-700 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                        {auditResult.detectives.rulebook.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-500 block">Average Promoter Pledge:</span>
                          <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                            {auditResult.detectives.rulebook.avgPromoterPledge}% {auditResult.detectives.rulebook.avgPromoterPledge === 0 ? '✓ (Clean 0% encumbrance)' : ''}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-500 block">High Debt Flags:</span>
                          <span className="font-mono text-slate-900 mt-0.5 block">
                            {auditResult.detectives.rulebook.highDebtHoldings.length > 0 
                              ? auditResult.detectives.rulebook.highDebtHoldings.join(', ') 
                              : 'None (All holdings within safe leverage limits)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detective 2: Chart Detective */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900">Robot 1: The Chart Detective</h3>
                          <p className="text-xs text-slate-500">RSI Oscillators, Moving Average Crossings & Momentum Velocity</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-semibold block">Technical Score</span>
                        <span className="text-xl font-black font-mono text-blue-700">
                          {auditResult.detectives.chart.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <p className="text-xs text-slate-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        {auditResult.detectives.chart.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-500 block">Portfolio RSI (14):</span>
                          <span className="font-mono font-bold text-slate-900 mt-0.5 block">{auditResult.detectives.chart.portfolioRsi}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-500 block">Above 200 EMA:</span>
                          <span className="font-mono font-bold text-slate-900 mt-0.5 block">{auditResult.detectives.chart.aboveEma200Pct}%</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-500 block">Momentum Leaders:</span>
                          <span className="font-mono text-emerald-700 font-bold mt-0.5 block">
                            {auditResult.detectives.chart.momentumLeaders.length > 0 ? auditResult.detectives.chart.momentumLeaders.join(', ') : 'Broadly neutral'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detective 3: News Detective */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                          <Newspaper className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900">Robot 3: The News Detective</h3>
                          <p className="text-xs text-slate-500">Market Mood, FII Net Flows & Verified Financial Wires</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-semibold block">Sentiment Score</span>
                        <span className="text-xl font-black font-mono text-emerald-700">
                          {auditResult.detectives.news.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <p className="text-xs text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        {auditResult.detectives.news.summary}
                      </p>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="font-bold text-slate-500 block mb-1">Institutional Signal Flow:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                            {auditResult.detectives.news.institutionalFlow}
                          </span>
                          <span className="text-slate-600">Net buyers across core benchmark securities</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PER-HOLDING ACTIONS */}
              {activeTab === 'holdings' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="pb-3 pl-2">Asset / Ticker</th>
                          <th className="pb-3">Shares</th>
                          <th className="pb-3">Avg Price</th>
                          <th className="pb-3">Live LTP</th>
                          <th className="pb-3">Weight</th>
                          <th className="pb-3">Gain/Loss</th>
                          <th className="pb-3">AI Verdict</th>
                          <th className="pb-3">Suggested Target</th>
                          <th className="pb-3 text-right pr-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {auditResult.holdingAudits.map((ha) => {
                          const isProfit = ha.unrealizedPnl >= 0;
                          const actionColors = {
                            ACCUMULATE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                            HOLD: 'bg-blue-50 text-blue-700 border-blue-200',
                            TRIM: 'bg-amber-50 text-amber-700 border-amber-200',
                            TAKE_PROFIT: 'bg-purple-50 text-purple-700 border-purple-200',
                            EXIT: 'bg-rose-50 text-rose-700 border-rose-200'
                          };

                          return (
                            <tr key={ha.ticker} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3.5 pl-2">
                                <div className="font-bold text-slate-900">{ha.ticker}</div>
                                <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{ha.companyName}</div>
                              </td>
                              <td className="py-3.5 font-mono font-bold text-slate-800">{ha.shares}</td>
                              <td className="py-3.5 font-mono text-slate-600">₹{ha.avgPrice.toFixed(2)}</td>
                              <td className="py-3.5 font-mono font-bold text-slate-900">₹{ha.currentPrice.toFixed(2)}</td>
                              <td className="py-3.5 font-mono font-bold text-indigo-700">{ha.portfolioWeightPct}%</td>
                              <td className="py-3.5 font-mono">
                                <span className={`font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {isProfit ? '+' : ''}₹{ha.unrealizedPnl.toFixed(2)}
                                </span>
                              </td>
                              <td className="py-3.5">
                                <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] border ${actionColors[ha.actionRecommendation]}`}>
                                  {ha.actionRecommendation.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="py-3.5 font-mono text-[11px] text-slate-600">
                                Target Wt: <span className="font-bold text-slate-900">{ha.suggestedWeightPct}%</span>
                              </td>
                              <td className="py-3.5 text-right pr-2">
                                <button
                                  onClick={() => {
                                    onSelectStock(ha.ticker);
                                    onClose();
                                  }}
                                  className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-full transition-colors inline-flex items-center gap-1 text-[11px] border border-indigo-200"
                                >
                                  Deep Dive
                                  <ArrowUpRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Explanatory Rationales */}
                  <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Holding Rationales & Stop Losses:</h4>
                    <div className="space-y-2">
                      {auditResult.holdingAudits.map(ha => (
                        <div key={ha.ticker} className="flex items-start gap-2 text-xs">
                          <span className="font-bold text-slate-900 shrink-0 font-mono">{ha.ticker}:</span>
                          <span className="text-slate-600">{ha.rationale}</span>
                          {ha.stopLossPrice && (
                            <span className="font-mono text-rose-600 font-semibold shrink-0 ml-auto">
                              SL: ₹{ha.stopLossPrice}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REBALANCE BLUEPRINT */}
              {activeTab === 'rebalance' && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200">
                    <h4 className="font-extrabold text-sm text-indigo-950 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-indigo-600" />
                      Risk-Adjusted Portfolio Optimization Strategy
                    </h4>
                    <p className="text-xs text-indigo-900 mt-1">
                      Calibrated for a <span className="font-bold capitalize">{riskProfile} Investor</span>. Follow these transparent steps to improve capital defense and compound returns.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {auditResult.rebalanceSuggestions.map((sug, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-3.5">
                        <div className={`p-2 rounded-xl shrink-0 ${
                          sug.actionType === 'SELL' ? 'bg-rose-50 text-rose-600' :
                          sug.actionType === 'BUY' ? 'bg-emerald-50 text-emerald-600' :
                          sug.actionType === 'DIVERSIFY' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          <span className="font-mono font-black text-xs">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{sug.description}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                              {sug.actionType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            <span className="font-semibold text-slate-700">Expected Impact:</span> {sug.impact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Audited via transparent mathematical models & official SEBI citations.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
