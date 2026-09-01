import React, { useState } from 'react';
import { Crown, AlertOctagon, Target, Percent, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { BossSynthesis, RiskProfileType, StockData } from '../types';

interface BossSynthesisViewProps {
  synthesis: BossSynthesis;
  stock: StockData;
  riskProfile: RiskProfileType;
  onChangeRiskProfile: (profile: RiskProfileType) => void;
}

export const BossSynthesisView: React.FC<BossSynthesisViewProps> = ({
  synthesis,
  stock,
  riskProfile,
  onChangeRiskProfile,
}) => {
  const [showSynthesisMatrix, setShowSynthesisMatrix] = useState(true);

  // Styling based on recommendation
  const getRecommendationStyle = () => {
    switch (synthesis.recommendation) {
      case 'STRONG_BUY':
        return {
          border: 'border-emerald-500/30',
          badgeText: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
        };
      case 'CAUTIOUS_BUY':
        return {
          border: 'border-cyan-500/30',
          badgeText: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
        };
      case 'HOLD_AND_WATCH':
        return {
          border: 'border-amber-500/30',
          badgeText: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
        };
      case 'REDUCE_EXPOSURE':
      case 'STRICT_AVOID':
      default:
        return {
          border: 'border-rose-500/30',
          badgeText: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
        };
    }
  };

  const style = getRecommendationStyle();

  return (
    <div className="bg-[#0A0A0E] rounded-2xl p-6 sm:p-7 border border-white/10 relative overflow-hidden transition-all duration-200">
      
      {/* Decorative Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Boss AI Synthesizer
              </span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.2 rounded bg-white/5 text-neutral-300 border border-white/10">
                Risk Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Final Multi-Agent Decision
            </h2>
          </div>
        </div>

        {/* Profile Switcher Tabs */}
        <div className="flex items-center bg-[#121218] p-0.5 rounded-lg border border-white/10 self-start md:self-center">
          <span className="text-xs text-neutral-400 mr-2 ml-2 hidden sm:inline">Profile:</span>
          {(['conservative', 'moderate', 'aggressive'] as RiskProfileType[]).map((p) => {
            const isSelected = p === riskProfile;
            return (
              <button
                key={p}
                onClick={() => onChangeRiskProfile(p)}
                className={`px-3 py-1 rounded-md text-xs capitalize font-medium transition-all ${
                  isSelected
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

      </div>

      {/* Degraded Resilience Notice */}
      {synthesis.degradedDataNotice && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{synthesis.degradedDataNotice}</span>
        </div>
      )}

      {/* Main Recommendation Hero Box */}
      <div className={`mt-6 rounded-xl bg-[#0E0E14] border ${style.border} p-5 sm:p-6 relative overflow-hidden`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div>
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${style.badgeText} uppercase tracking-wider`}>
                {synthesis.recommendation.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-neutral-400">
                Confidence: <strong className="text-white font-mono">{synthesis.confidenceScore}%</strong>
              </span>
              <span className="text-xs text-neutral-400">
                • Risk Grade: <strong className="text-white font-mono">{synthesis.riskLevel}</strong>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              {synthesis.recommendationLabel}
            </h3>
            
            <p className="text-sm text-neutral-300">
              {synthesis.headline}
            </p>
          </div>

          <div className="text-right lg:border-l lg:border-white/10 lg:pl-6 shrink-0">
            <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
              Profile Matched
            </div>
            <div className="text-base font-bold text-white capitalize mt-0.5">
              {riskProfile} Investor
            </div>
            <div className="text-[11px] font-mono text-cyan-400 mt-1">
              Latency: {synthesis.totalLatencyMs}ms
            </div>
          </div>

        </div>

        {/* Custom Profile Reasoning */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <strong className="text-white font-medium">Strategy Allocation: </strong>
            {synthesis.customProfileReasoning}
          </p>
        </div>
      </div>

      {/* Action Plan Grid */}
      <div className="mt-6">
        <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-cyan-400" />
          Execution Plan & Capital Safeguards
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Action */}
          <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
            <div className="text-[10px] font-medium text-neutral-400 uppercase">Suggested Action</div>
            <div className="text-xs font-semibold text-white mt-1 leading-snug">
              {synthesis.actionPlan.suggestedAction}
            </div>
          </div>

          {/* Entry Range */}
          <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
            <div className="text-[10px] font-medium text-neutral-400 uppercase">Safe Entry Range</div>
            <div className="text-xs font-bold text-cyan-400 font-mono mt-1">
              {synthesis.actionPlan.entryRange || 'At Market Open'}
            </div>
          </div>

          {/* Target Upside */}
          <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
            <div className="text-[10px] font-medium text-neutral-400 uppercase">Target Upside</div>
            <div className="text-xs font-bold text-emerald-400 font-mono mt-1">
              {synthesis.actionPlan.targetPrice || `₹${(stock.currentPrice * 1.15).toFixed(1)}`}
            </div>
          </div>

          {/* Mandatory Stop-Loss */}
          <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
            <div className="text-[10px] font-medium text-neutral-400 uppercase">Mandatory Stop-Loss</div>
            <div className="text-xs font-bold text-rose-400 font-mono mt-1">
              {synthesis.actionPlan.stopLossPrice || `₹${(stock.currentPrice * 0.94).toFixed(1)}`}
            </div>
          </div>

        </div>

        {/* Position Sizing Recommendation */}
        <div className="mt-3 bg-[#0E0E14] rounded-xl p-3 border border-white/5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Percent className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="text-neutral-300">
              <strong className="text-white font-medium">Position Sizing Rule:</strong> {synthesis.actionPlan.positionSizeGuidance} ({synthesis.actionPlan.timeHorizon})
            </span>
          </div>
        </div>
      </div>

      {/* Synthesis Weighting Matrix */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            Detective Weighting Matrix (For {riskProfile} Profile)
          </h4>
          <button
            onClick={() => setShowSynthesisMatrix(!showSynthesisMatrix)}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {showSynthesisMatrix ? 'Hide Details' : 'Show Details'}
            {showSynthesisMatrix ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showSynthesisMatrix && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {synthesis.synthesisMatrix.map((item) => (
              <div key={item.agentId} className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white">{item.agentName}</span>
                  <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.2 rounded">
                    {(item.weightGiven * 100).toFixed(0)}% Weight
                  </span>
                </div>
                <div className="w-full bg-[#181822] h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-neutral-300 h-full rounded-full"
                    style={{ width: `${item.weightGiven * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {item.whyWeightedThisWay}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
