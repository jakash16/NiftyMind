import React from 'react';
import { Activity, ShieldCheck, Newspaper, AlertTriangle, CheckCircle2, ChevronRight, FileText, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { DetectiveOutput } from '../types';

interface AgentDetectiveCardProps {
  detective: DetectiveOutput;
  onInspectReasoning: (detective: DetectiveOutput) => void;
  onViewCitations: (detective: DetectiveOutput) => void;
}

export const AgentDetectiveCard: React.FC<AgentDetectiveCardProps> = ({
  detective,
  onInspectReasoning,
  onViewCitations,
}) => {
  // Agent Theme Styles with Geometric Balance Palette
  const getTheme = () => {
    switch (detective.agentId) {
      case 'chart':
        return {
          border: 'border-slate-200',
          accentBg: 'bg-indigo-50/60',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          iconBg: 'bg-indigo-600 text-white',
          circleBadge: 'bg-indigo-100 text-indigo-700',
          robotNum: 'Robot 1',
          roleTitle: 'Technical Agent',
          icon: Activity
        };
      case 'rulebook':
        return {
          border: 'border-slate-200',
          accentBg: 'bg-emerald-50/60',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          iconBg: 'bg-emerald-600 text-white',
          circleBadge: 'bg-emerald-100 text-emerald-700',
          robotNum: 'Robot 2',
          roleTitle: 'Regulatory & RAG Agent',
          icon: ShieldCheck
        };
      case 'news':
      default:
        return {
          border: 'border-slate-200',
          accentBg: 'bg-amber-50/60',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          iconBg: 'bg-amber-600 text-white',
          circleBadge: 'bg-amber-100 text-amber-700',
          robotNum: 'Robot 3',
          roleTitle: 'Sentiment & Macro Agent',
          icon: Newspaper
        };
    }
  };

  const theme = getTheme();
  const IconComponent = theme.icon;

  // Signal Badge Colors
  const getVerdictBadge = () => {
    switch (detective.verdict) {
      case 'BULLISH':
      case 'SAFE':
      case 'POSITIVE':
        return {
          text: detective.verdict,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2
        };
      case 'BEARISH':
      case 'HIGH_RISK':
      case 'NEGATIVE':
        return {
          text: detective.verdict,
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: AlertTriangle
        };
      case 'WARNING':
        return {
          text: 'WARNING / INCOMPLETE',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: AlertCircle
        };
      case 'NEUTRAL':
      default:
        return {
          text: detective.verdict,
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Activity
        };
    }
  };

  const verdictBadge = getVerdictBadge();
  const VerdictIcon = verdictBadge.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden">
      
      {/* Degraded Notice Banner if active */}
      {detective.degradedStatus?.isDegraded && (
        <div className="mb-3 -mt-2 -mx-2 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[11px] font-bold flex items-center justify-between shadow-xs animate-pulse-subtle">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Accident Recovery: {detective.degradedStatus.reason}</span>
          </span>
          <span className="bg-amber-700 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
            Confidence {detective.degradedStatus.impactOnConfidence}%
          </span>
        </div>
      )}

      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          
          {/* Avatar and Role */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center shadow-xs shrink-0 ring-2 ring-slate-100`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {theme.robotNum}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {theme.roleTitle}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {detective.agentName}
              </h3>
            </div>
          </div>

          {/* Confidence Meter Badge */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-xs font-semibold text-slate-400">Confidence:</span>
              <span className="font-extrabold text-sm text-slate-900 font-mono">
                {detective.confidenceScore}%
              </span>
            </div>
            <div className="w-20 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden ml-auto">
              <div
                className={`h-full rounded-full ${
                  detective.confidenceScore >= 80 ? 'bg-emerald-500' : detective.confidenceScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${detective.confidenceScore}%` }}
              />
            </div>
          </div>

        </div>

        {/* Intuitive Analogy Box (Kid-Friendly Explanation) */}
        <div className={`${theme.accentBg} rounded-xl p-3.5 border border-slate-200/70 mb-3.5`}>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase tracking-wide mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>How This Detective Thinks (Analogy)</span>
          </div>
          <p className="text-xs font-medium text-slate-700 leading-relaxed italic">
            "{detective.analogy}"
          </p>
        </div>

        {/* Detective's Summary Verdict */}
        <div className="mb-3.5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold text-slate-800">Detective's Finding:</span>
            <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${verdictBadge.color}`}>
              <VerdictIcon className="w-3.5 h-3.5" />
              {verdictBadge.text}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
            {detective.summary}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 mb-3.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Hedge-Fund Grade Telemetry
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(detective.keyMetrics).map(([key, value]) => (
              <div key={key} className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] font-medium text-slate-400 truncate">{key}</div>
                <div className="text-xs font-bold text-slate-900 font-mono truncate">{value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Actions: Step-by-Step Reasoning & Proof Citations */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        
        {/* Reasoning Steps button */}
        <button
          onClick={() => onInspectReasoning(detective)}
          className="flex-1 py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          title="Watch step-by-step how this robot came up with its answer"
        >
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Show Thinking ({detective.reasoningChain.length} steps)</span>
        </button>

        {/* Proof Citations button */}
        <button
          onClick={() => onViewCitations(detective)}
          className="py-2 px-3.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-indigo-200 transition-colors shadow-2xs"
          title="View exact verified quotes from official SEBI and news documents"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>Proof ({detective.citations.length})</span>
        </button>

      </div>

    </div>
  );
};
