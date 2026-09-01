import React from 'react';
import { Activity, ShieldCheck, Newspaper, AlertTriangle, CheckCircle2, FileText, Sparkles, Clock, AlertCircle } from 'lucide-react';
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
  const getTheme = () => {
    switch (detective.agentId) {
      case 'chart':
        return {
          accentBg: 'bg-[#0E0E14] border-white/5',
          badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
          iconBg: 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/20',
          robotNum: 'Agent 01',
          roleTitle: 'Technical Analyst',
          icon: Activity
        };
      case 'rulebook':
        return {
          accentBg: 'bg-[#0E0E14] border-white/5',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          iconBg: 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20',
          robotNum: 'Agent 02',
          roleTitle: 'Regulatory RAG',
          icon: ShieldCheck
        };
      case 'news':
      default:
        return {
          accentBg: 'bg-[#0E0E14] border-white/5',
          badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
          iconBg: 'bg-violet-950/40 text-violet-400 border border-violet-500/20',
          robotNum: 'Agent 03',
          roleTitle: 'Sentiment & Macro',
          icon: Newspaper
        };
    }
  };

  const theme = getTheme();
  const IconComponent = theme.icon;

  const getVerdictBadge = () => {
    switch (detective.verdict) {
      case 'BULLISH':
      case 'SAFE':
      case 'POSITIVE':
        return {
          text: detective.verdict,
          color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          icon: CheckCircle2
        };
      case 'BEARISH':
      case 'HIGH_RISK':
      case 'NEGATIVE':
        return {
          text: detective.verdict,
          color: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
          icon: AlertTriangle
        };
      case 'WARNING':
        return {
          text: 'WARNING',
          color: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          icon: AlertCircle
        };
      case 'NEUTRAL':
      default:
        return {
          text: detective.verdict,
          color: 'bg-white/5 text-neutral-300 border-white/10',
          icon: Activity
        };
    }
  };

  const verdictBadge = getVerdictBadge();
  const VerdictIcon = verdictBadge.icon;

  return (
    <div className="bg-[#0A0A0E] rounded-2xl p-6 border border-white/10 flex flex-col justify-between transition-all duration-200 hover:border-white/20 relative overflow-hidden">
      
      {/* Degraded Notice Banner */}
      {detective.degradedStatus?.isDegraded && (
        <div className="mb-4 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>Fallback: {detective.degradedStatus.reason}</span>
          </span>
          <span className="bg-amber-500/20 px-1.5 py-0.2 rounded text-[10px] font-mono">
            {detective.degradedStatus.impactOnConfidence}% Conf
          </span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-5">
          
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-neutral-400">
                  {theme.robotNum}
                </span>
                <span className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border ${theme.badge}`}>
                  {theme.roleTitle}
                </span>
              </div>
              <h3 className="font-semibold text-base text-white leading-tight mt-0.5">
                {detective.agentName}
              </h3>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end font-mono">
              <span className="text-xs text-neutral-400">Conf:</span>
              <span className="font-semibold text-xs text-white">
                {detective.confidenceScore}%
              </span>
            </div>
            <div className="w-16 bg-[#181822] h-1.5 rounded-full mt-1.5 overflow-hidden ml-auto">
              <div
                className={`h-full rounded-full ${
                  detective.confidenceScore >= 80 
                    ? 'bg-emerald-400' 
                    : detective.confidenceScore >= 60 
                    ? 'bg-amber-400' 
                    : 'bg-rose-400'
                }`}
                style={{ width: `${detective.confidenceScore}%` }}
              />
            </div>
          </div>

        </div>

        {/* Finding Verdict */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-neutral-400 font-medium">Verdict:</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border ${verdictBadge.color}`}>
              <VerdictIcon className="w-3 h-3" />
              {verdictBadge.text}
            </span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed bg-[#0E0E14] p-3 rounded-xl border border-white/5 font-mono">
            {detective.summary}
          </p>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5 mb-4">
          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
            Telemetry Signals
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(detective.keyMetrics).map(([key, value]) => (
              <div key={key} className="bg-[#14141C] px-2.5 py-1.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-neutral-400 truncate font-mono">{key}</div>
                <div className="text-xs font-medium text-white truncate mt-0.5 font-mono">{value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
        
        {/* Thinking steps button */}
        <button
          onClick={() => onInspectReasoning(detective)}
          className="flex-1 py-2 px-3 rounded-lg bg-[#121218] hover:bg-[#1A1A24] text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-all"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Thinking Trace ({detective.reasoningChain.length})</span>
        </button>

        {/* Citations Proof button */}
        <button
          onClick={() => onViewCitations(detective)}
          className="py-2 px-3 rounded-lg bg-[#121218] hover:bg-[#1A1A24] text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-violet-400" />
          <span>Proof ({detective.citations.length})</span>
        </button>

      </div>

    </div>
  );
};
