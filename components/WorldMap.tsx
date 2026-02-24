
import React, { useState, useMemo, memo } from 'react';
import { Signal, NodeStatus, Source, RawEvent, ThreatNode, SignalAnalysis } from '../types';
import { Info, Zap, Globe, ArrowRight, Activity, Clock, Target, Shield, Skull, Radio, Lock, AlertCircle, Triangle, Crosshair, EyeOff, MapPin, ShieldCheck, History, TrendingUp } from 'lucide-react';
import { SOURCES_REGISTRY } from '../constants';

interface WorldMapProps {
  signals: Signal[];
  threatNodes: ThreatNode[];
  rawEvents: RawEvent[];
  selectedItem: Signal | ThreatNode | null;
  onSelectItem: (item: Signal | ThreatNode | null) => void;
  onOpenHistory?: (item: Signal | ThreatNode) => void;
}

const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;

const PostureMarker = memo(({ status, x, y, isSelected, isHovered, onClick, onMouseEnter, onMouseLeave }: any) => {
  const getStatusColor = (s: NodeStatus) => {
    switch (s) {
      case 'red': return 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)]';
      case 'yellow': return 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,1)]';
      case 'white': return 'bg-white shadow-[0_0_20px_rgba(255,255,255,1)]';
      case 'green': return 'bg-[#c3d333] shadow-[0_0_20px_rgba(195,211,51,1)]';
      default: return 'bg-white';
    }
  };

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 z-10
        ${isSelected ? 'z-50 scale-150' : isHovered ? 'z-40 scale-125' : 'scale-100'}`}
      style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`marker-ripple border rounded-full ${status === 'red' ? 'border-red-500/50' : status === 'white' ? 'border-white/30' : 'border-[#c3d333]/50'}`} />
      <div className={`transition-all duration-300 w-3 h-3 rounded-full border border-black ${getStatusColor(status)} ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#05080c]' : ''}`} />
    </div>
  );
});

const WorldMap: React.FC<WorldMapProps> = ({ signals, threatNodes, rawEvents, selectedItem, onSelectItem, onOpenHistory }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * MAP_WIDTH;
    const y = ((90 - lat) / 180) * MAP_HEIGHT;
    return { x, y };
  };

  const getMapTransform = () => {
    if (!selectedItem) return { transform: 'scale(1) translate(0, 0)' };
    const { x, y } = project(selectedItem.lat, selectedItem.lng);
    return { transform: `scale(2.8) translate(${50 - x}%, ${50 - y}%)` };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const getPostureLabel = (status: NodeStatus) => {
    switch (status) {
      case 'red': return { text: 'ACTIVE CRISIS / WARFARE', color: 'text-red-500' };
      case 'yellow': return { text: 'ESCALATING TENSION', color: 'text-amber-500' };
      case 'white': return { text: 'STRUCTURAL DECAY', color: 'text-white' };
      case 'green': return { text: 'STABLE BASELINE', color: 'text-[#c3d333]' };
      default: return { text: 'EVALUATING', color: 'text-gray-500' };
    }
  };

  const isThreatNode = (item: any): item is ThreatNode => !!item && 'threat_node_id' in item;

  const calculateCredibility = (item: Signal | ThreatNode) => {
    const sourceIds = (item as any).source_ids || [];
    if (sourceIds.length === 0) {
      return (item as any).source_label ? 0.75 : 0.82;
    }
    
    const reliabilities = sourceIds.map((id: string) => {
      const source = SOURCES_REGISTRY.find(s => s.source_id === id);
      return source ? source.reliability : 0.70;
    });

    const average = reliabilities.reduce((a: number, b: number) => a + b, 0) / reliabilities.length;
    return average;
  };

  const credibilityScore = selectedItem ? calculateCredibility(selectedItem) : 0;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#030508] cursor-crosshair group/map" onMouseMove={handleMouseMove}>
      <div className="scanline-overlay" />
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute h-full w-[1px] bg-[#c3d333]/10" style={{ left: `${mousePos.x}%` }} />
        <div className="absolute w-full h-[1px] bg-[#c3d333]/10" style={{ top: `${mousePos.y}%` }} />
      </div>

      <div className="world-map-container absolute inset-0" style={getMapTransform()}>
        <div className="map-silhouette opacity-[0.45] brightness-125 saturate-150 contrast-125" />
        <div className="dotted-map opacity-50" />

        {/* Selected Country Center Line */}
        {selectedItem && selectedItem.analysis?.country_center && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20">
            {(() => {
              const start = project(selectedItem.lat, selectedItem.lng);
              const end = project(selectedItem.analysis.country_center.lat, selectedItem.analysis.country_center.lng);
              return (
                <line
                  x1={`${start.x}%`} y1={`${start.y}%`}
                  x2={`${end.x}%`} y2={`${end.y}%`}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
              );
            })()}
          </svg>
        )}

        {/* Render Ongoing Threat Nodes */}
        {threatNodes.map(tn => {
           const { x, y } = project(tn.lat, tn.lng);
           return (
             <PostureMarker 
               key={tn.threat_node_id}
               status={tn.status}
               x={x} y={y}
               isSelected={isThreatNode(selectedItem) && selectedItem.threat_node_id === tn.threat_node_id}
               isHovered={hoveredId === tn.threat_node_id}
               onClick={() => onSelectItem(isThreatNode(selectedItem) && selectedItem.threat_node_id === tn.threat_node_id ? null : tn)}
               onMouseEnter={() => setHoveredId(tn.threat_node_id)}
               onMouseLeave={() => setHoveredId(null)}
             />
           );
        })}

        {/* Render Signals */}
        {signals.map(sig => {
          const { x, y } = project(sig.lat, sig.lng);
          return (
            <PostureMarker
              key={sig.signal_id}
              status={sig.status}
              x={x} y={y}
              isSelected={!isThreatNode(selectedItem) && selectedItem?.signal_id === sig.signal_id}
              isHovered={hoveredId === sig.signal_id}
              onClick={() => onSelectItem(!isThreatNode(selectedItem) && selectedItem?.signal_id === sig.signal_id ? null : sig)}
              onMouseEnter={() => setHoveredId(sig.signal_id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          );
        })}
      </div>

      {selectedItem && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-8 bg-[#05080c]/98 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,1)] w-[520px] tooltip-enter overflow-y-auto max-h-[92%] scrollbar-hide">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8 border-b border-white/10 pb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${selectedItem.status === 'red' ? 'bg-red-500 animate-pulse' : selectedItem.status === 'yellow' ? 'bg-amber-500' : 'bg-white'}`} />
                 <span className={`${getPostureLabel(selectedItem.status).color} text-[10px] font-black uppercase tracking-[0.4em] font-mono-tactical`}>
                   POSTURE: {getPostureLabel(selectedItem.status).text}
                 </span>
              </div>
              <h3 className="text-white font-black text-2xl tracking-tighter uppercase leading-none">
                {isThreatNode(selectedItem) ? selectedItem.threat_type.replace('_', ' ') : selectedItem.headline}
              </h3>
            </div>
            <button onClick={() => onSelectItem(null)} className="p-2.5 hover:bg-white/5 rounded-xl text-gray-600 hover:text-white transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Geo-Location Hierarchy */}
            <div className="grid grid-cols-3 gap-3">
               <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl group hover:bg-cyan-500/20 transition-all">
                  <p className="text-[8px] text-cyan-400 font-black uppercase tracking-widest mb-1">COUNTRY</p>
                  <p className="text-[11px] text-white font-bold uppercase truncate">
                    {selectedItem.region_id.split('/')[1]?.trim() || selectedItem.region_id}
                  </p>
               </div>
               <div className="p-4 bg-[#c3d333]/10 border border-[#c3d333]/30 rounded-2xl group hover:bg-[#c3d333]/20 transition-all">
                  <p className="text-[8px] text-[#c3d333] font-black uppercase tracking-widest mb-1">REGION</p>
                  <p className="text-[11px] text-white font-bold uppercase truncate">
                    {selectedItem.region_id.split('/')[0]?.trim() || 'Global'}
                  </p>
               </div>
               <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl group hover:bg-purple-500/20 transition-all">
                  <p className="text-[8px] text-purple-400 font-black uppercase tracking-widest mb-1">PLACE</p>
                  <p className="text-[11px] text-white font-bold uppercase truncate">
                    {isThreatNode(selectedItem) ? 'PRIMARY THREAT' : 'SIGNAL POINT'}
                  </p>
               </div>
            </div>

            {/* Source Credibility Section */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl shadow-inner">
               <div className="flex items-center justify-between mb-3">
                  <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-[#c3d333]" /> Weighted Source Reliability
                  </p>
                  <span className="text-[11px] font-black text-[#c3d333] font-mono-tactical">{(credibilityScore * 100).toFixed(1)}%</span>
               </div>
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c3d333] shadow-[0_0_10px_rgba(195,211,51,0.5)]" style={{ width: `${credibilityScore * 100}%` }} />
               </div>
               {(selectedItem as any).source_label && (
                 <p className="text-[9px] text-gray-600 font-bold uppercase mt-3 tracking-tighter truncate border-t border-white/5 pt-2">
                   SOURCES: {(selectedItem as any).source_label}
                 </p>
               )}
            </div>

            {/* Analysis Core */}
            <div className="p-6 bg-black/40 border border-white/10 rounded-3xl space-y-4 shadow-xl">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] text-white font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="text-[#c3d333]" /> Analysis Core
                  </p>
                  <button 
                    onClick={() => onOpenHistory?.(selectedItem)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#c3d333]/10 border border-[#c3d333]/20 rounded-lg text-[9px] font-black text-[#c3d333] hover:bg-[#c3d333]/20 transition-all uppercase tracking-widest"
                  >
                    <History size={10} /> View History
                  </button>
               </div>
               <div className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-[#c3d333]/40 pl-5">
                 {selectedItem.analysis?.risk_posture || (isThreatNode(selectedItem) ? selectedItem.persistence_reason : 'No posture data available.')}
               </div>
            </div>

            {/* Systemic Cascade Path */}
            {selectedItem.analysis?.cross_domain_cascade_paths && (
              <div className="space-y-3">
                <p className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp size={12} /> Systemic Cascade Path
                </p>
                <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl text-[12px] text-gray-200 leading-relaxed italic border-l-4 border-l-cyan-500">
                  {selectedItem.analysis.cross_domain_cascade_paths}
                </div>
              </div>
            )}

            {/* Tactical Widgets */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all group">
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Shield size={10} className="text-emerald-500" /> Confidence Score
                </p>
                <p className="text-2xl font-black text-white font-mono-tactical group-hover:text-emerald-400 transition-colors">
                  {((selectedItem.analysis?.confidence || 0.85) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all group">
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Clock size={10} className="text-amber-500" /> Effect Time
                </p>
                <p className="text-[12px] font-black text-white uppercase tracking-wider group-hover:text-amber-400 transition-colors mt-2">
                  {selectedItem.analysis?.time_to_effect || 'IMMEDIATE'}
                </p>
              </div>
            </div>

            {/* Primary Actors */}
            {isThreatNode(selectedItem) && (
              <div className="space-y-3 border-t border-white/5 pt-6">
                 <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Active Stakeholders / Actors</p>
                 <div className="flex flex-wrap gap-2">
                    {selectedItem.primary_actors.map(actor => (
                      <span key={actor} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 uppercase hover:text-white hover:border-[#c3d333]/40 transition-all cursor-default">{actor}</span>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
