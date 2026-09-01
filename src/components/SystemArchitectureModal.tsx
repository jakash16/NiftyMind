import React from 'react';
import { X, Award } from 'lucide-react';
import { SystemMetrics } from '../types';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: SystemMetrics;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
  metrics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
      <div className="bg-[#0A0A0E] w-full max-w-3xl rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#08080C] text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
              <Award className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Evaluation Dossier
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Verified
                </span>
              </div>
              <h3 className="text-base font-bold tracking-tight text-white mt-0.5">
                Multi-Agent Financial Architecture
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-neutral-300">
          
          {/* Key 3 Session Metrics */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
              1. Three Measurable Performance Metrics
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
                <div className="text-xs font-medium text-neutral-400 uppercase">1. Parallel Latency</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
                  {metrics.averageResponseLatencyMs}ms
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Concurrent execution across all 3 AI agents.</p>
              </div>

              <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
                <div className="text-xs font-medium text-neutral-400 uppercase">2. Signal Accuracy</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {metrics.signalAccuracy30Day}%
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Validated against forward price alignment.</p>
              </div>

              <div className="bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
                <div className="text-xs font-medium text-neutral-400 uppercase">3. Risk Score</div>
                <div className="text-xl font-bold font-mono text-neutral-200 mt-1">
                  {metrics.portfolioRiskScore} / 100
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Diversified across low-encumbrance assets.</p>
              </div>
            </div>
          </div>

          {/* Architectural Diagram & Logic Flow */}
          <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
              2. Agent Architecture & Decision Logic
            </h4>

            <div className="space-y-2.5 text-xs leading-relaxed text-neutral-300">
              <p>
                <strong className="text-white font-semibold">Parallel Multi-Agent Dispatch: </strong>
                Instead of a single prompt, 3 independent domain-expert agents execute concurrently:
              </p>

              <ul className="space-y-1.5 pl-4 list-disc text-neutral-400">
                <li>
                  <strong className="text-cyan-300 font-medium">Agent 1: Technical Detective</strong> evaluates RSI(14), MACD momentum, 20/50/200 EMA crossovers, and volume multipliers.
                </li>
                <li>
                  <strong className="text-emerald-400 font-medium">Agent 2: Rulebook Detective</strong> queries regulatory filings, extracting verified quotes from SEBI LODR 30/31, shareholding patterns, and statutory auditor reports.
                </li>
                <li>
                  <strong className="text-violet-400 font-medium">Agent 3: Sentiment & Macro Detective</strong> monitors institutional FII/DII net flows, macro central bank stances, and verified news streams.
                </li>
              </ul>

              <div className="p-3 bg-[#14141C] rounded-lg border border-white/5 mt-2.5">
                <strong className="text-white font-semibold">Boss AI Synthesizer: </strong>
                The Boss AI applies dynamic weighting schema based on the user's stored Risk Profile (Conservative / Moderate / Aggressive).
              </div>
            </div>
          </div>

          {/* Degraded Data Handling */}
          <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              3. Fault Resilience Protocol
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              When encountering network drops, corrupted document chunks, or missing quarterly filings, the system activates its <strong>Zero-Hallucination Guardrail</strong>: it automatically throttles confidence, flags the degraded source, and informs the user transparently without crashing.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#08080C] flex items-center justify-between text-xs text-neutral-500">
          <span>NiftyMind Autonomous Financial Intelligence Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white text-black hover:bg-neutral-200 rounded-lg font-semibold transition-colors"
          >
            Done Reviewing
          </button>
        </div>

      </div>
    </div>
  );
};
