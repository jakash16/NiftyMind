import React, { useState } from 'react';
import { 
  X, ShieldCheck, Activity, Newspaper, Sparkles, 
  ArrowUpRight, Scale, Layers, PieChart, RefreshCw
} from 'lucide-react';
import { PortfolioAuditResult, RiskProfileType, UserProfile } from '../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85">
      <div className="bg-[#0A0A0E] rounded-2xl border border-white/10 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#08080C]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Autonomous 3-Agent Evaluation
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-neutral-300 capitalize border border-white/10">
                  {riskProfile} Profile
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {displayName}'s Multi-Agent Audit
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onReAudit}
              disabled={isLoading}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Re-run assessment"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#08080C] px-5 gap-1.5 pt-2 text-xs overflow-x-auto">
          {[
            { id: 'overview', label: 'Synthesis & Verdict', icon: Sparkles },
            { id: 'detectives', label: '3 Agents Breakdown', icon: Layers },
            { id: 'holdings', label: 'Holdings Audit', icon: PieChart },
            { id: 'rebalance', label: 'Rebalance Blueprint', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 font-medium border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-white text-white bg-white/5 rounded-t-lg'
                    : 'border-transparent text-neutral-400 hover:text-white rounded-t-lg'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {isLoading || !auditResult ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-white">
                  Agents Auditing Portfolio Holdings...
                </p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                  Correlating promoter encumbrance, momentum curves, and FII flows.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & SYNTHESIS */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* Top Boss Synthesis Card */}
                  <div className="bg-[#0E0E14] border border-white/5 rounded-xl p-5 text-white relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2 text-cyan-300 text-xs font-medium uppercase tracking-wide">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Boss AI Synthesis
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                          {auditResult.verdictTitle}
                        </h3>
                      </div>

                      {/* Overall Score Badge */}
                      <div className="flex items-center gap-3 bg-[#08080C] px-4 py-2.5 rounded-xl border border-white/10">
                        <div className="text-right">
                          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Health Score</div>
                          <div className="text-xl font-bold font-mono text-emerald-400">
                            {auditResult.overallScore}/100
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
                          {auditResult.overallScore >= 75 ? 'A+' : auditResult.overallScore >= 60 ? 'B' : 'C'}
                        </div>
                      </div>
                    </div>

                    <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mt-4">
                      {auditResult.summary}
                    </p>

                    {/* Summary Quick Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/10">
                      <div className="bg-[#08080C] rounded-lg p-3 border border-white/5">
                        <span className="text-[10px] text-neutral-400 block font-medium uppercase">Total Value</span>
                        <span className="text-sm font-bold font-mono text-white mt-0.5 block">
                          ₹{auditResult.totalHoldingsValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="bg-[#08080C] rounded-lg p-3 border border-white/5">
                        <span className="text-[10px] text-neutral-400 block font-medium uppercase">Unrealized P&L</span>
                        <span className={`text-sm font-bold font-mono mt-0.5 block ${auditResult.totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {auditResult.totalUnrealizedPnl >= 0 ? '+' : ''}₹{auditResult.totalUnrealizedPnl.toFixed(2)} ({auditResult.totalUnrealizedPnlPct >= 0 ? '+' : ''}{auditResult.totalUnrealizedPnlPct.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="bg-[#08080C] rounded-lg p-3 border border-white/5">
                        <span className="text-[10px] text-neutral-400 block font-medium uppercase">Weighted RSI</span>
                        <span className="text-sm font-bold font-mono text-cyan-300 mt-0.5 block">
                          {auditResult.detectives.chart.portfolioRsi}
                        </span>
                      </div>
                      <div className="bg-[#08080C] rounded-lg p-3 border border-white/5">
                        <span className="text-[10px] text-neutral-400 block font-medium uppercase">Avg Promoter Pledge</span>
                        <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block">
                          {auditResult.detectives.rulebook.avgPromoterPledge}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Detectives Consensus Summary Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Rulebook Detective */}
                    <div className="bg-[#0E0E14] rounded-xl border border-white/5 p-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs text-white">Rulebook Agent</h4>
                            <span className="text-[10px] text-neutral-500">Governance & Pledges</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {auditResult.detectives.rulebook.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                        {auditResult.detectives.rulebook.summary}
                      </p>
                    </div>

                    {/* Chart Detective */}
                    <div className="bg-[#0E0E14] rounded-xl border border-white/5 p-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <Activity className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs text-white">Technical Agent</h4>
                            <span className="text-[10px] text-neutral-500">Momentum & Levels</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {auditResult.detectives.chart.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                        {auditResult.detectives.chart.summary}
                      </p>
                    </div>

                    {/* News Detective */}
                    <div className="bg-[#0E0E14] rounded-xl border border-white/5 p-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
                            <Newspaper className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs text-white">Macro Agent</h4>
                            <span className="text-[10px] text-neutral-500">FII / DII Flows</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.2 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {auditResult.detectives.news.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                        {auditResult.detectives.news.summary}
                      </p>
                    </div>
                  </div>

                  {/* Sector Allocation Breakdown */}
                  {auditResult.sectorAllocation.length > 0 && (
                    <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-1.5">
                        <PieChart className="w-3.5 h-3.5 text-cyan-400" />
                        Sector Diversification Matrix
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {auditResult.sectorAllocation.map((sec) => (
                          <div key={sec.sector} className="bg-[#08080C] p-3 rounded-lg border border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-xs text-white truncate">{sec.sector}</span>
                              <span className="font-mono font-medium text-xs text-cyan-300">{sec.percentage}%</span>
                            </div>
                            <div className="w-full bg-[#181822] h-1.5 rounded-full mt-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${sec.riskLevel === 'HIGH' ? 'bg-rose-500' : 'bg-white'}`} 
                                style={{ width: `${Math.min(100, sec.percentage)}%` }} 
                              />
                            </div>
                            <div className="text-[10px] font-mono text-neutral-400 mt-2 flex justify-between">
                              <span>₹{sec.value.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                              <span className={sec.riskLevel === 'HIGH' ? 'text-rose-400 font-semibold' : 'text-neutral-400'}>
                                {sec.riskLevel === 'HIGH' ? 'Over-weight' : 'Balanced'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DETECTIVES */}
              {activeTab === 'detectives' && (
                <div className="space-y-4">
                  {/* Detective 1: Rulebook */}
                  <div className="bg-[#0E0E14] rounded-xl border border-white/5 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">Agent 2: Rulebook Detective</h3>
                          <p className="text-xs text-neutral-400">SEBI Regulatory Filings & Promoter Pledges</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 font-medium uppercase block">Score</span>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          {auditResult.detectives.rulebook.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      <p className="text-xs text-neutral-300 bg-[#08080C] p-3 rounded-lg border border-white/5 font-mono">
                        {auditResult.detectives.rulebook.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                        <div className="p-2.5 bg-[#08080C] rounded-lg border border-white/5">
                          <span className="text-neutral-400 block text-[10px] uppercase">Avg Promoter Pledge:</span>
                          <span className="font-bold text-white mt-0.5 block">
                            {auditResult.detectives.rulebook.avgPromoterPledge}%
                          </span>
                        </div>
                        <div className="p-2.5 bg-[#08080C] rounded-lg border border-white/5">
                          <span className="text-neutral-400 block text-[10px] uppercase">High Debt Holdings:</span>
                          <span className="text-white mt-0.5 block">
                            {auditResult.detectives.rulebook.highDebtHoldings.length > 0 
                              ? auditResult.detectives.rulebook.highDebtHoldings.join(', ') 
                              : 'None (Safe limits)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detective 2: Chart */}
                  <div className="bg-[#0E0E14] rounded-xl border border-white/5 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">Agent 1: Technical Detective</h3>
                          <p className="text-xs text-neutral-400">Momentum Oscillators & Moving Averages</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 font-medium uppercase block">Score</span>
                        <span className="text-base font-bold font-mono text-cyan-400">
                          {auditResult.detectives.chart.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      <p className="text-xs text-neutral-300 bg-[#08080C] p-3 rounded-lg border border-white/5 font-mono">
                        {auditResult.detectives.chart.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                        <div className="p-2.5 bg-[#08080C] rounded-lg border border-white/5">
                          <span className="text-neutral-400 block text-[10px] uppercase">Portfolio RSI:</span>
                          <span className="font-bold text-white mt-0.5 block">{auditResult.detectives.chart.portfolioRsi}</span>
                        </div>
                        <div className="p-2.5 bg-[#08080C] rounded-lg border border-white/5">
                          <span className="text-neutral-400 block text-[10px] uppercase">Above 200 EMA:</span>
                          <span className="font-bold text-white mt-0.5 block">{auditResult.detectives.chart.aboveEma200Pct}%</span>
                        </div>
                        <div className="p-2.5 bg-[#08080C] rounded-lg border border-white/5">
                          <span className="text-neutral-400 block text-[10px] uppercase">Momentum Leaders:</span>
                          <span className="text-cyan-300 font-bold mt-0.5 block truncate">
                            {auditResult.detectives.chart.momentumLeaders.length > 0 ? auditResult.detectives.chart.momentumLeaders.join(', ') : 'Neutral'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detective 3: News */}
                  <div className="bg-[#0E0E14] rounded-xl border border-white/5 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold">
                          <Newspaper className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">Agent 3: Macro & Sentiment Detective</h3>
                          <p className="text-xs text-neutral-400">Institutional FII/DII Net Flows</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 font-medium uppercase block">Score</span>
                        <span className="text-base font-bold font-mono text-violet-400">
                          {auditResult.detectives.news.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      <p className="text-xs text-neutral-300 bg-[#08080C] p-3 rounded-lg border border-white/5 font-mono">
                        {auditResult.detectives.news.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HOLDINGS */}
              {activeTab === 'holdings' && (
                <div className="space-y-3 font-mono">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
                          <th className="pb-2.5 pl-2">Asset</th>
                          <th className="pb-2.5">Qty</th>
                          <th className="pb-2.5">Avg</th>
                          <th className="pb-2.5">Live</th>
                          <th className="pb-2.5">Weight</th>
                          <th className="pb-2.5">Gain/Loss</th>
                          <th className="pb-2.5">Verdict</th>
                          <th className="pb-2.5 text-right pr-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {auditResult.holdingAudits.map((ha) => {
                          const isProfit = ha.unrealizedPnl >= 0;
                          return (
                            <tr key={ha.ticker} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 pl-2">
                                <div className="font-semibold text-white font-sans">{ha.ticker}</div>
                                <div className="text-[10px] text-neutral-500 truncate max-w-[140px] font-sans">{ha.companyName}</div>
                              </td>
                              <td className="py-3 text-neutral-200">{ha.shares}</td>
                              <td className="py-3 text-neutral-400">₹{ha.avgPrice.toFixed(2)}</td>
                              <td className="py-3 text-white">₹{ha.currentPrice.toFixed(2)}</td>
                              <td className="py-3 text-cyan-300">{ha.portfolioWeightPct}%</td>
                              <td className="py-3">
                                <span className={`font-medium ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {isProfit ? '+' : ''}₹{ha.unrealizedPnl.toFixed(2)}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/5 text-neutral-300 border border-white/10">
                                  {ha.actionRecommendation.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="py-3 text-right pr-2">
                                <button
                                  onClick={() => {
                                    onSelectStock(ha.ticker);
                                    onClose();
                                  }}
                                  className="px-2.5 py-0.5 bg-[#14141C] hover:bg-[#1C1C26] text-neutral-200 font-medium rounded transition-colors inline-flex items-center gap-1 text-[11px] border border-white/10"
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
                </div>
              )}

              {/* TAB 4: REBALANCE */}
              {activeTab === 'rebalance' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-[#0E0E14] rounded-xl border border-white/5">
                    <h4 className="font-semibold text-xs text-white flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-cyan-400" />
                      Risk-Adjusted Rebalance Optimization
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Calibrated for a <span className="text-white font-medium capitalize">{riskProfile} Profile</span>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {auditResult.rebalanceSuggestions.map((sug, idx) => (
                      <div key={idx} className="p-3 bg-[#0E0E14] rounded-xl border border-white/5 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center font-bold text-neutral-300 text-xs shrink-0 font-mono">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs text-white">{sug.description}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-neutral-300 uppercase">
                              {sug.actionType}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">
                            <span className="text-neutral-300 font-medium">Impact:</span> {sug.impact}
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
        <div className="px-5 py-3 border-t border-white/10 bg-[#08080C] flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            Audited via mathematical models & SEBI citations.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
