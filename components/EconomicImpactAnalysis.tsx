
import React from 'react';
import { Signal, ThreatNode } from '../types';
import { TrendingUp, BarChart3, Coins, Globe, Target, ArrowUpRight, ArrowDownRight, Briefcase, Activity } from 'lucide-react';

interface EconomicImpactAnalysisProps {
  signals: Signal[];
  threatNodes: ThreatNode[];
}

const EconomicImpactAnalysis: React.FC<EconomicImpactAnalysisProps> = ({ signals, threatNodes }) => {
  const allNodes = [...signals, ...threatNodes];
  const priorityNodes = allNodes.filter(n => n.status === 'red' || n.status === 'yellow').slice(0, 10);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Macro Overview Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#0a0f18]/60 border border-white/5 rounded-3xl backdrop-blur-md">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <Globe size={14} className="text-[#c3d333]" /> Estimated Global GDP Drag
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono-tactical">−1.42%</span>
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Aggregate Shift</span>
          </div>
          <div className="mt-4 flex gap-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="w-[65%] bg-red-500" />
          </div>
          <p className="mt-4 text-[9px] text-gray-500 leading-relaxed italic">Cumulative drag across G20 sectors based on chokepoint friction and energy volatility spikes.</p>
        </div>

        <div className="p-6 bg-[#0a0f18]/60 border border-white/5 rounded-3xl backdrop-blur-md">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity size={14} className="text-cyan-500" /> Supply Chain Friction Index
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono-tactical">74.8</span>
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">High Volatility</span>
          </div>
          <div className="mt-4 flex gap-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="w-[75%] bg-amber-500" />
          </div>
          <p className="mt-4 text-[9px] text-gray-500 leading-relaxed italic">Tracking vessel rerouting, insurance premiums in chokepoints, and cross-border customs delays.</p>
        </div>

        <div className="p-6 bg-[#c3d333]/5 border border-[#c3d333]/20 rounded-3xl backdrop-blur-md">
          <p className="text-[10px] text-[#c3d333] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <Coins size={14} /> Identified Alpha Opps
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono-tactical">14</span>
            <span className="text-[10px] text-[#c3d333] font-bold uppercase tracking-widest">Active Thesis</span>
          </div>
          <p className="mt-4 text-[10px] text-white/80 font-bold uppercase tracking-tight">Focus: Energy Arbitrage & Critical Mineral Futures</p>
        </div>
      </div>

      {/* Deep Analysis Registry */}
      <div className="space-y-6">
        <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] border-l-2 border-[#c3d333] pl-4">Profit Acquisition & Alpha Theses</h3>
        
        <div className="grid grid-cols-1 gap-6">
          {priorityNodes.map((node) => {
            const isSig = 'signal_id' in node;
            const headline = isSig ? node.headline : node.threat_type.replace('_', ' ');
            
            // Simulating deep numbers for the UI
            const bpsDrag = Math.floor(Math.random() * 45) + 5;
            const impactScore = Math.floor(Math.random() * 50) + 50;

            return (
              <div key={isSig ? node.signal_id : node.threat_node_id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Left: Geopolitical Impact */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${node.status === 'red' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                         <h4 className="text-xl font-black text-white uppercase tracking-tighter">{headline}</h4>
                      </div>
                      <span className="text-[10px] font-mono-tactical text-[#c3d333]">{node.region_id}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">Macro-Economy Drag</p>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-red-500 font-mono-tactical">−{bpsDrag}bps</span>
                          <p className="text-[9px] text-gray-500 uppercase font-bold">GDP Contribution Decay</p>
                        </div>
                      </div>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">Trade Route Friction</p>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-amber-500 font-mono-tactical">+{impactScore}%</span>
                          <p className="text-[9px] text-gray-500 uppercase font-bold">Logistics Cost Spike</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sector Sensitivity Analysis</p>
                      <div className="flex flex-wrap gap-4">
                        {['Energy', 'Finance', 'Logistics', 'Tech'].map(sector => (
                          <div key={sector} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[10px] font-bold text-gray-200 uppercase">{sector}</span>
                            <span className="text-[10px] font-mono text-red-500">{(Math.random() * -10).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Investment Alpha (Profit acquisition) */}
                  <div className="lg:w-[400px] flex flex-col bg-[#c3d333]/5 border border-[#c3d333]/10 rounded-[2rem] p-6 shadow-2xl">
                    <div className="flex items-center gap-2 mb-6">
                      <Target size={18} className="text-[#c3d333]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Alpha Capture Strategy</span>
                    </div>

                    <div className="space-y-6 flex-1">
                      <div>
                        <p className="text-[8px] font-black text-[#c3d333] uppercase tracking-widest mb-2">Core Thesis</p>
                        <p className="text-xs text-gray-300 leading-relaxed font-medium">
                          {node.analysis?.alpha_thesis?.strategy || 
                          `Arbitrage the volatility in regional infrastructure dependencies. While direct equity suffers, 
                          secondary logistics futures and regional chokepoint REITs are currently mispriced relative to 
                          the projected 6-month decay curve.`}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[8px] font-black text-[#c3d333] uppercase tracking-widest">Target Instruments</p>
                        <div className="grid grid-cols-2 gap-2">
                          {(node.analysis?.alpha_thesis?.instruments || ['FX Swaps', 'Commodity Put', 'CDS', 'Regional Index']).map(instr => (
                             <div key={instr} className="px-3 py-2 bg-black/40 border border-white/5 rounded-lg text-[9px] font-mono text-gray-300 uppercase">{instr}</div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                        <div>
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Potential ROI (12m)</p>
                          <p className="text-xl font-black text-[#c3d333] font-mono-tactical">+{Math.floor(Math.random() * 40) + 12}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Liquidity Risk</p>
                          <p className="text-[10px] font-black text-amber-500 uppercase">Medium-High</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EconomicImpactAnalysis;
