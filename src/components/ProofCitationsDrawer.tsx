import React from 'react';
import { X, FileText, CheckCircle2, ExternalLink, ShieldCheck, Newspaper, Hash, Calendar } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Proof & Official Citations
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  100% Grounded
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {detective.agentName} Source Evidence
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

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          <p className="text-xs text-slate-600">
            Every insight produced by NiftyMind is grounded in immutable official regulatory filings or verified news feeds. No hallucinations or unverified social media tips.
          </p>

          {detective.citations.length > 0 ? (
            detective.citations.map((cite) => (
              <div
                key={cite.id}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 hover:border-emerald-300 transition-all"
              >
                {/* Source Badge & Document Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                      {cite.sourceType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {cite.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 shrink-0 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {cite.filingDate}
                  </span>
                </div>

                {/* Exact Verified Quote */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Exact Document Quote:</span>
                  </div>
                  <blockquote className="text-xs font-medium text-slate-800 italic leading-relaxed">
                    {cite.verifiedQuote}
                  </blockquote>
                </div>

                {/* Page & Clause Meta */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-400" />
                    <span>Reference: <strong>{cite.pageOrClause}</strong></span>
                  </div>
                  <div className="text-emerald-700 font-bold">
                    Verification Score: {cite.confidenceScore}%
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
              ⚠️ No official document citations could be retrieved (Degraded Data Scenario active). System safely withheld unverified claims.
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-colors"
          >
            Close Citations
          </button>
        </div>

      </div>
    </div>
  );
};
