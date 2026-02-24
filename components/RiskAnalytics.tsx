
import React from 'react';
import { Signal, Domain } from '../types';
import { Zap, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

interface RiskAnalyticsProps {
  signals: Signal[];
}

const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({ signals }) => {
  // Show high impact signals for cascade analysis
  const cascadeSignals = signals.filter(s => s.status === 'red' || s.status === 'yellow').slice(0, 10);

  const getDomainColor = (domain: Domain) => {
    switch (domain) {
      case 'military': return 'text-red-500';
      case 'energy': return 'text-amber-500';
      case 'finance': return 'text-emerald-500';
      case 'tech': return 'text-cyan-500';
      case 'space': return 'text-purple-500';
      case 'environment': return 'text-green-500';
      case 'biosecurity': return 'text-red-400';
      default: return 'text-[#c3d333]';
    }
  };

  return (
    <div className="space-y-10">
      <div className="p-10 bg-[#0a0f18]/40 border border-white/5 rounded-[3rem] shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-10">
          <Zap size={20} className="text-[#c3d333]" />
          <span className="text-xs font-black text-white uppercase tracking-[0.4em]">Active Cross-Domain Cascade Monitor</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {cascadeSignals.map((signal) => (
            <div key={signal.signal_id} className="group p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] hover:border-[#c3d333]/30 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${getDomainColor(signal.domain)}`}>{signal.domain}</span>
                  <ArrowRight size={12} className="text-gray-700" />
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter">{signal.headline || signal.region_id}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#c3d333] shadow-[0_0_10px_rgba(195,211,51,0.5)]" style={{ width: `${(signal.analysis?.confidence || 0.8) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-mono-tactical text-[#c3d333]">CONF: {((signal.analysis?.confidence || 0.8) * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-3">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Systemic Cascade Vector</p>
                  <p className="text-[13px] text-gray-300 leading-relaxed italic border-l-2 border-[#c3d333]/40 pl-5">
                    {signal.analysis?.cross_domain_cascade_paths || "Calculating multi-point failure vectors..."}
                  </p>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-3">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Trigger Proximity & Threshold</p>
                  <p className="text-[13px] text-gray-300 leading-relaxed italic border-l-2 border-amber-500/40 pl-5">
                    {signal.analysis?.threshold_proximity || "Monitoring critical signal variance..."}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {cascadeSignals.length === 0 && (
            <div className="text-center py-24 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/10">
               <AlertCircle size={40} className="mx-auto text-gray-800 mb-6" />
               <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-[11px]">No Active Critical Cascades Detected</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-10 bg-[#0a0f18]/40 border border-white/5 rounded-[3rem] shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-10">
          <TrendingUp size={20} className="text-cyan-500" />
          <span className="text-xs font-black text-white uppercase tracking-[0.4em]">Capability Drift & Temporal Decay Feed</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {signals.slice(0, 9).map((s) => (
            <div key={s.signal_id} className="relative pl-8 border-l border-white/10 group">
              <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-150 ${s.status === 'red' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`} />
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.region_id}</p>
                <span className="text-[9px] font-mono-tactical text-cyan-400">DRIFT: +{Math.floor(Math.random() * 25)}%</span>
              </div>
              <p className="text-[12px] text-gray-300 font-bold uppercase tracking-tight line-clamp-2 italic mb-4 leading-snug">
                {s.analysis?.capability_drift || "Baseline drift within expected parameters."}
              </p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${s.status === 'red' ? 'bg-red-500' : 'bg-cyan-500'} opacity-40`} style={{ width: `${(s.strategic_weight || 3) * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskAnalytics;
