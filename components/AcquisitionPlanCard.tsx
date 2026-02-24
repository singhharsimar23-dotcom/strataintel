
import React from 'react';
import { AcquisitionPlan } from '../types';
import { Database, Zap, Eye, AlertTriangle, Timer } from 'lucide-react';

interface AcquisitionPlanCardProps {
  plan: AcquisitionPlan;
}

const AcquisitionPlanCard: React.FC<AcquisitionPlanCardProps> = ({ plan }) => {
  const isInsufficient = plan.coverage_status === 'insufficient';

  return (
    <div className={`flex flex-col bg-[#0a0f18]/60 border rounded-2xl p-6 transition-all duration-300
      ${isInsufficient ? 'border-red-500/30 bg-red-500/[0.02]' : 'border-white/5 hover:border-[#c3d333]/30'}`}>
      
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Region Focus</span>
            {isInsufficient && (
              <span className="flex items-center gap-1 text-[8px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-black border border-red-500/20 uppercase tracking-tighter">
                <AlertTriangle size={8} /> Coverage Blindness Risk
              </span>
            )}
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">{plan.region_id}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Strat Weight</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1.5 h-3 rounded-sm ${i <= plan.strategic_weight ? 'bg-[#c3d333]' : 'bg-white/5'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database size={12} className="text-gray-500" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Baseline Datasets</span>
          </div>
          <ul className="space-y-1.5">
            {plan.baseline_sources.map((s, i) => (
              <li key={i} className="text-[10px] text-gray-400 font-mono-tactical border-l border-white/10 pl-2">{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} className="text-[#c3d333]" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Event Sources</span>
          </div>
          <ul className="space-y-1.5">
            {plan.event_sources.map((s, i) => (
              <li key={i} className="text-[10px] text-gray-400 font-mono-tactical border-l border-[#c3d333]/20 pl-2">{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye size={12} className="text-amber-500" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ambiguity Hooks</span>
          </div>
          <ul className="space-y-1.5">
            {plan.ambiguity_sources.map((s, i) => (
              <li key={i} className="text-[10px] text-gray-400 font-mono-tactical border-l border-amber-500/20 pl-2">{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 bg-white/[0.01] -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <Timer size={14} className="text-gray-400" />
            </div>
            <div>
              <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Silence Watch</p>
              <p className="text-[10px] text-white font-bold">{plan.silence_watch.expected_signal}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Max Gap</p>
            <p className="text-[11px] font-mono-tactical text-[#c3d333]">{plan.silence_watch.max_gap_hours}H Threshold</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcquisitionPlanCard;
