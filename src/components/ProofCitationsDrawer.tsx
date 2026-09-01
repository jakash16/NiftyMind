import React from 'react';
import { X, CheckCircle2, ShieldCheck, Hash, Calendar } from 'lucide-react';
import { DetectiveOutput } from '../types';

interface ProofCitationsDrawerProps {
  detective: DetectiveOutput | null;
  onClose: () => void;
}

export const ProofCitationsDrawer: React.FC<ProofCitationsDrawerProps> = ({
  detective,
  onClose,
}) => {
  if (!detective) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
      <div className="bg-[#0A0A0E] w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#08080C]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Proof & Official Citations
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Grounded
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {detective.agentName} Source Evidence
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

        {/* Drawer Body */}
        <div className="p-5 overflow-y-auto space-y-3">
          
          <p className="text-xs text-neutral-400">
            Every insight produced by NiftyMind is grounded in verified regulatory filings (SEBI/BSE/NSE) or official news feeds.
          </p>

          {detective.citations.length > 0 ? (
            detective.citations.map((cite) => (
              <div
                key={cite.id}
                className="bg-[#0E0E14] rounded-xl p-4 border border-white/5 space-y-2.5 hover:border-white/20 transition-all"
              >
                {/* Source Badge & Document Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-white/5 text-neutral-300 border border-white/10 uppercase tracking-wider">
                      {cite.sourceType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {cite.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 shrink-0 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {cite.filingDate}
                  </span>
                </div>

                {/* Exact Verified Quote */}
                <div className="bg-[#14141C] p-3 rounded-lg border border-white/5">
                  <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Exact Document Extract:</span>
                  </div>
                  <blockquote className="text-xs text-neutral-200 italic leading-relaxed font-mono">
                    "{cite.verifiedQuote}"
                  </blockquote>
                </div>

                {/* Page & Clause Meta */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5 font-mono">
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-neutral-500" />
                    <span>Ref: <strong className="text-white font-normal">{cite.pageOrClause}</strong></span>
                  </div>
                  <div className="text-emerald-400">
                    Confidence: {cite.confidenceScore}%
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="p-4 text-center bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-300 text-xs">
              No document citations could be retrieved (Degraded Data Scenario). System safely withheld unverified claims.
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#08080C] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white text-black hover:bg-neutral-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close Citations
          </button>
        </div>

      </div>
    </div>
  );
};
