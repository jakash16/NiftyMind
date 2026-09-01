import React, { useState } from 'react';
import { Crown, Sparkles, Shield, ArrowUpRight, AlertOctagon, Target, CheckCircle, Percent, HelpCircle, Layers, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showELI5, setShowELI5] = useState(true);
  const [showSynthesisMatrix, setShowSynthesisMatrix] = useState(true);

  // Styling based on recommendation
  const getRecommendationStyle = () => {
    switch (synthesis.recommendation) {
      case 'STRONG_BUY':
        return {
          bg: 'bg-emerald-600',
          lightBg: 'bg-emerald-50',
          border: 'border-emerald-200',
          badgeText: 'text-emerald-700 bg-emerald-100 border-emerald-300',
          pill: 'bg-emerald-600 text-white'
        };
      case 'CAUTIOUS_BUY':
        return {
          bg: 'bg-teal-600',
          lightBg: 'bg-teal-50',
          border: 'border-teal-200',
          badgeText: 'text-teal-700 bg-teal-100 border-teal-300',
          pill: 'bg-teal-600 text-white'
        };
      case 'HOLD_AND_WATCH':
        return {
          bg: 'bg-amber-600',
          lightBg: 'bg-amber-50',
          border: 'border-amber-200',
          badgeText: 'text-amber-700 bg-amber-100 border-amber-300',
          pill: 'bg-amber-600 text-white'
        };
      case 'REDUCE_EXPOSURE':
      case 'STRICT_AVOID':
      default:
        return {
          bg: 'bg-rose-600',
          lightBg: 'bg-rose-50',
          border: 'border-rose-200',
          badgeText: 'text-rose-700 bg-rose-100 border-rose-300',
          pill: 'bg-rose-600 text-white'
        };
    }
  };

  const style = getRecommendationStyle();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8 relative overflow-hidden">
      
      {/* Decorative Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md ring-4 ring-indigo-50">
            <Crown className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                The Boss AI Synthesizer
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Personalized Risk Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Final Actionable Decision
            </h2>
          </div>
        </div>

        {/* Profile Switcher Tabs (to show different outputs for different risk profiles) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 self-start md:self-center">
          <span className="text-xs font-bold text-slate-500 mr-2 ml-2 hidden sm:inline">Simulate Profile:</span>
          {(['conservative', 'moderate', 'aggressive'] as RiskProfileType[]).map((p) => {
            const isSelected = p === riskProfile;
            return (
              <button
                key={p}
                onClick={() => onChangeRiskProfile(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                  isSelected
                    ? 'bg-white text-indigo-700 shadow-2xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
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
        <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{synthesis.degradedDataNotice}</span>
        </div>
      )}

      {/* Main Recommendation Hero Box */}
      <div className={`mt-5 rounded-2xl ${style.lightBg} border ${style.border} p-5 sm:p-6`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${style.badgeText} uppercase tracking-wider`}>
                {synthesis.recommendation.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Synthesis Confidence: <strong className="text-slate-900 font-mono">{synthesis.confidenceScore}%</strong>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                • Risk Grade: <strong className="text-slate-900">{synthesis.riskLevel}</strong>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">
              {synthesis.recommendationLabel}
            </h3>
            
            <p className="text-sm font-semibold text-slate-700">
              {synthesis.headline}
            </p>
          </div>

          <div className="text-right lg:border-l lg:border-slate-200 lg:pl-6 shrink-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Profile Matched
            </div>
            <div className="text-base font-extrabold text-slate-900 capitalize">
              {riskProfile} Investor
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Processed in <strong className="font-mono text-slate-800">{synthesis.totalLatencyMs}ms</strong>
            </div>
          </div>

        </div>

        {/* Custom Profile Reasoning Highlight */}
        <div className="mt-4 pt-4 border-t border-slate-200/70">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <strong className="text-slate-900 font-bold">Why this recommendation for you: </strong>
            {synthesis.customProfileReasoning}
          </p>
        </div>
      </div>

      {/* Plain English Kid-Friendly Analogy Section */}
      {synthesis.beginnerAnalogy && (
        <div className="mt-4 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl p-4 border border-amber-200/70">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                💡
              </span>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Simple Explanation (Analogy)
              </span>
            </div>
            <button
              onClick={() => setShowELI5(!showELI5)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-0.5"
            >
              {showELI5 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
          {showELI5 && (
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium italic mt-1 pl-8">
              "{synthesis.beginnerAnalogy}"
            </p>
          )}
        </div>
      )}

      {/* Action Plan Grid: Entry, Target, Stop-Loss, Position Sizing */}
      <div className="mt-6">
        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-blue-600" />
          Execution Plan & Capital Safeguards
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Suggested Action */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Suggested Action</div>
            <div className="text-xs font-bold text-slate-900 mt-1 leading-snug">
              {synthesis.actionPlan.suggestedAction}
            </div>
          </div>

          {/* Entry Range */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Safe Entry Range</div>
            <div className="text-sm font-extrabold text-blue-700 font-mono mt-1">
              {synthesis.actionPlan.entryRange || 'At Market Open'}
            </div>
          </div>

          {/* Target Upside */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Target Upside</div>
            <div className="text-sm font-extrabold text-emerald-700 font-mono mt-1">
              {synthesis.actionPlan.targetPrice || `₹${(stock.currentPrice * 1.15).toFixed(1)}`}
            </div>
          </div>

          {/* Stop Loss (Capital Guard) */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Mandatory Stop-Loss</div>
            <div className="text-sm font-extrabold text-rose-700 font-mono mt-1">
              {synthesis.actionPlan.stopLossPrice || `₹${(stock.currentPrice * 0.94).toFixed(1)}`}
            </div>
          </div>

        </div>

        {/* Position Sizing Recommendation */}
        <div className="mt-3 bg-blue-50/60 rounded-2xl p-3 border border-blue-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-800">
              <strong>Position Sizing Rule:</strong> {synthesis.actionPlan.positionSizeGuidance} ({synthesis.actionPlan.timeHorizon})
            </span>
          </div>
        </div>
      </div>

      {/* Synthesis Weighting Matrix */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            Detective Weighting Matrix (For {riskProfile} Profile)
          </h4>
          <button
            onClick={() => setShowSynthesisMatrix(!showSynthesisMatrix)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            {showSynthesisMatrix ? 'Hide Details' : 'Show Details'}
            {showSynthesisMatrix ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showSynthesisMatrix && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {synthesis.synthesisMatrix.map((item) => (
              <div key={item.agentId} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">{item.agentName}</span>
                  <span className="text-xs font-mono font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {(item.weightGiven * 100).toFixed(0)}% Weight
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${item.weightGiven * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
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
