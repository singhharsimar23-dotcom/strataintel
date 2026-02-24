import React from 'react';
import { Signal, ThreatNode } from '../types';
import { CheckCircle, Target, Users, Zap, Shield, ChevronRight } from 'lucide-react';

interface SolutionViewProps {
  item: Signal | ThreatNode | null;
  allItems: (Signal | ThreatNode)[];
  onSelectItem: (item: Signal | ThreatNode | null) => void;
}

const SolutionView: React.FC<SolutionViewProps> = ({ item, allItems, onSelectItem }) => {
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-700">
        <div className="w-20 h-20 flex items-center justify-center bg-white/5 rounded-full border border-dashed border-white/20 mb-8">
          <Target size={32} className="text-gray-700" />
        </div>
        <p className="text-gray-600 font-black uppercase tracking-[0.5em] text-xs text-center leading-loose">
          Awaiting target selection<br/>
          <span className="text-[10px] opacity-60">derive tactical resolution paths from operational context</span>
        </p>
      </div>
    );
  }

  const solution = item.analysis?.practical_solution;
  const headline = 'signal_id' in item ? item.headline : item.threat_type.replace(/_/g, ' ');

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-start justify-between border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-[#c3d333] uppercase tracking-[0.4em]">Strategic Resolution Protocol</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic font-mono-tactical">
            {headline}
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{item.region_id}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Success Probability</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-[#c3d333] font-mono-tactical">
              {solution?.feasibility_score ? (solution.feasibility_score * 100).toFixed(0) : '82'}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Shield size={18} className="text-[#c3d333]" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Long-Term Strategic Alignment</h3>
            </div>
            <div className="p-8 bg-[#c3d333]/5 border border-[#c3d333]/20 rounded-[2.5rem] shadow-[inset_0_0_20px_rgba(195,211,51,0.02)]">
              <p className="text-gray-200 italic leading-relaxed text-sm">
                {solution?.long_term_strategy || "Orchestrate a multi-lateral framework for systemic risk mitigation while maintaining baseline operational readiness to prevent cascade failure across adjacent domains."}
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-amber-500" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Tactical Execution Steps</h3>
            </div>
            <div className="space-y-4">
              {(solution?.tactical_steps || [
                "Establish hardened communication relays in disputed sectors.",
                "Deploy algorithmic sentiment monitors to track narrative shifts.",
                "Initiate tiered resource redundancy for critical infrastructure.",
                "Coordinate cross-domain stakeholder response protocols."
              ]).map((step, i) => (
                <div key={i} className="flex items-start gap-5 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all group">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-xs font-black shrink-0 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem]">
            <div className="flex items-center gap-2 mb-6">
              <Users size={18} className="text-cyan-500" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Stakeholder Matrix</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(solution?.key_stakeholders || ["Regional MOD", "Telecom Conglomerates", "NGO Response Units", "Global Finance Hubs"]).map((sh) => (
                <span key={sh} className="px-4 py-2 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-[10px] font-black text-cyan-400 uppercase tracking-tighter hover:bg-cyan-500/10 transition-colors cursor-default">
                  {sh}
                </span>
              ))}
            </div>
          </section>

          <section className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem]">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle size={18} className="text-emerald-500" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Operational Success Metrics</h3>
            </div>
            <div className="space-y-4">
              {(solution?.success_metrics || ["90% Signal Continuity", "Zero Kinetic Escalation", "Supply Chain Latency < 10%"]).map((metric, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">{metric}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem]">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-gray-500" />
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Resource Commitment</h3>
            </div>
            <p className="text-[11px] text-gray-400 font-mono-tactical italic leading-relaxed">
              {solution?.resource_requirements || "Requires tier-1 priority allocation of regional intelligence assets and digital hardening protocols."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SolutionView;