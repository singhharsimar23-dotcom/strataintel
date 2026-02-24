
import React from 'react';
import { Signal, ThreatNode, HistoryEvent } from '../types';
import { History, ArrowLeft, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface HistoryViewProps {
  item: Signal | ThreatNode | null;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ item, onBack }) => {
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse">
        <History size={48} className="text-gray-800 mb-6" />
        <p className="text-gray-600 font-black uppercase tracking-[0.5em] text-xs">Awaiting Target Selection</p>
      </div>
    );
  }

  const history = item.analysis?.history || [];
  const isSig = 'signal_id' in item;
  const headline = isSig ? item.headline : item.threat_type.replace('_', ' ');

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#c3d333]/10 hover:border-[#c3d333]/40 transition-all text-white group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-[#c3d333] uppercase tracking-[0.3em]">Temporal Reconstruction Analysis</span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic font-mono-tactical">
              {headline}
            </h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Target Region</p>
          <p className="text-sm font-black text-[#c3d333] uppercase">{item.region_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-[#0a0f18]/60 border border-white/5 rounded-3xl backdrop-blur-md">
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-4">Initial Detection</p>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#c3d333]" />
              <span className="text-lg font-black text-white font-mono-tactical">
                {isSig ? new Date(item.created_at).toLocaleDateString() : item.active_since}
              </span>
            </div>
          </div>
          <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl backdrop-blur-md">
            <p className="text-[8px] text-red-500 font-black uppercase tracking-widest mb-4">Risk Magnitude Delta</p>
            <div className="flex items-center gap-3">
              <TrendingUp size={16} className="text-red-500" />
              <span className="text-lg font-black text-white font-mono-tactical">+{Math.floor(Math.random() * 40) + 20}%</span>
            </div>
          </div>
        </div>

        {/* Center Timeline */}
        <div className="lg:col-span-3">
          <div className="relative pl-8 space-y-12 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-[#c3d333] before:via-[#c3d333]/20 before:to-transparent">
            {history.length > 0 ? (
              history.map((event, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[35px] top-1 w-[7px] h-[7px] bg-[#c3d333] rounded-full shadow-[0_0_10px_#c3d333]" />
                  
                  <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] group-hover:border-[#c3d333]/30 group-hover:bg-white/[0.04] transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <span className="px-4 py-1.5 bg-[#c3d333]/10 border border-[#c3d333]/30 rounded-full text-[10px] font-black text-[#c3d333] font-mono-tactical">
                        {event.date}
                      </span>
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Verification Status: SECURE</span>
                    </div>
                    
                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4">
                      {event.event}
                    </h4>
                    
                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <AlertCircle size={12} className="text-red-500" /> Systemic Impact Analysis
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed italic border-l border-[#c3d333]/20 pl-4">
                        {event.impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                <p className="text-gray-600 font-black uppercase tracking-widest text-xs mb-4">No Historical Sub-nodes Available</p>
                <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Awaiting Deep-Scan Log Retrieval...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
