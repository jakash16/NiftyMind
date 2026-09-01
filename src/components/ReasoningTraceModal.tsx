import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Terminal } from 'lucide-react';
import { DetectiveOutput } from '../types';

interface ReasoningTraceModalProps {
  detective: DetectiveOutput | null;
  onClose: () => void;
}

export const ReasoningTraceModal: React.FC<ReasoningTraceModalProps> = ({
  detective,
  onClose,
}) => {
  if (!detective) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
      <div className="bg-[#0A0A0E] w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#08080C]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Execution Trace & Reasoning
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-neutral-300 border border-white/10">
                  {detective.latencyMs}ms
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {detective.agentName} ({detective.agentRole})
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Sequential Reasoning Pipeline
            </h4>

            {detective.reasoningChain.map((step, idx) => {
              const isLast = idx === detective.reasoningChain.length - 1;
              const isCompleted = step.status === 'completed';
              const isWarning = step.status === 'warning';

              return (
                <div key={step.stepNumber} className="relative flex items-start gap-3">
                  {!isLast && (
                    <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-white/10 -ml-[1px]" />
                  )}

                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-xs z-10 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : isWarning ? <AlertTriangle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 bg-[#0E0E14] rounded-xl p-3.5 border border-white/5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h5 className="text-xs font-semibold text-white">
                        Step {step.stepNumber}: {step.title}
                      </h5>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-neutral-400">
                        {step.timestamp} • {step.latencyMs}ms
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                      {step.description}
                    </p>

                    {step.dataPointsUsed && step.dataPointsUsed.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-medium text-neutral-400">Telemetry:</span>
                        {step.dataPointsUsed.map((dp, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#14141C] border border-white/5 text-neutral-300"
                          >
                            {dp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification Verdict */}
          <div className="mt-4 p-4 rounded-xl bg-[#0E0E14] border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Classification</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {detective.verdict} <span className="font-mono text-xs text-neutral-400 font-normal">(Confidence: {detective.confidenceScore}%)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Citations</div>
              <div className="text-xs font-semibold text-neutral-300 mt-0.5">
                {detective.citations.length} Verified Sources
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#08080C] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white text-black hover:bg-neutral-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close Trace
          </button>
        </div>

      </div>
    </div>
  );
};
