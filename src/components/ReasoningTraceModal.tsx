import React from 'react';
import { X, Clock, CheckCircle2, AlertTriangle, XCircle, Activity, ShieldCheck, Newspaper, Sparkles, Terminal } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Execution Trace & Reasoning Chain
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {detective.latencyMs}ms latency
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {detective.agentName} ({detective.agentRole})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Step-by-Step Reasoning Flow */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
            <strong className="font-bold">Analogy: </strong> {detective.analogy}
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Sequential Reasoning Steps (100% Transparent)
            </h4>

            {detective.reasoningChain.map((step, idx) => {
              const isLast = idx === detective.reasoningChain.length - 1;
              const isCompleted = step.status === 'completed';
              const isWarning = step.status === 'warning';

              return (
                <div key={step.stepNumber} className="relative flex items-start gap-4">
                  {/* Timeline Bar */}
                  {!isLast && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -ml-[1px]" />
                  )}

                  {/* Step Icon */}
                  <div
                    className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-xs z-10 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isWarning
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isWarning ? <AlertTriangle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>

                  {/* Step Details */}
                  <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Step {step.stepNumber}: {step.title}
                      </h5>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {step.timestamp} • {step.latencyMs}ms
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </p>

                    {step.dataPointsUsed && step.dataPointsUsed.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold text-slate-400">Data ingested:</span>
                        {step.dataPointsUsed.map((dp, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700"
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
          <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Output Classification</div>
              <div className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5">
                {detective.verdict} (Confidence: {detective.confidenceScore}%)
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Citations Attached</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">
                {detective.citations.length} Verified Sources
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-colors"
          >
            Close Trace Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
