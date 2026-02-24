import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar, RefreshCw, AlertTriangle, Flame, Activity, Zap, Clock, Shield, Lightbulb
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import WorldMap from './components/WorldMap';
import RiskAnalytics from './components/RiskAnalytics';
import EconomicImpactAnalysis from './components/EconomicImpactAnalysis';
import AcquisitionPlanCard from './components/AcquisitionPlanCard';
import SolutionView from './components/SolutionView';
import InvestmentIntelligence from './components/InvestmentIntelligence';
import HistoryView from './components/HistoryView';
import { BASELINE_SIGNALS, BASELINE_THREAT_NODES } from './constants';
import { Signal, ThreatNode, AcquisitionPlan, GlobalInvestmentIntelligence } from './types';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY_SIGNALS = 'gsap_v5_signals_synced_v4';
const STORAGE_KEY_THREATS = 'gsap_v5_threats_synced_v4';
const STORAGE_KEY_INTEL = 'gsap_v5_global_intel_synced_v4';

const App: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SIGNALS);
    return saved ? JSON.parse(saved) : BASELINE_SIGNALS;
  });

  const [threatNodes, setThreatNodes] = useState<ThreatNode[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THREATS);
    return saved ? JSON.parse(saved) : BASELINE_THREAT_NODES;
  });

  const [globalIntel, setGlobalIntel] = useState<GlobalInvestmentIntelligence | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_INTEL);
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedItem, setSelectedItem] = useState<Signal | ThreatNode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('map');

  useEffect(() => { localStorage.setItem(STORAGE_KEY_SIGNALS, JSON.stringify(signals)); }, [signals]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_THREATS, JSON.stringify(threatNodes)); }, [threatNodes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_INTEL, JSON.stringify(globalIntel)); }, [globalIntel]);

  const runIntelligencePipeline = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(p => p < 95 ? p + 5 : p);
    }, 80);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as an Intelligence Synthesis Engine and Strategic Alpha Analyst.
      
      CORE MANDATE: 
      - Generate 15-20 SIGNAL nodes and 10-12 THREAT nodes with all sub-profiles (acquisition, history, practical_solution).
      - ALSO generate a "global_investment_intelligence" object that analyzes ALL generated problems.
      - "global_investment_intelligence" MUST contain:
          1. "summary": A macro-financial overview of how global instability is creating specific arbitrage opportunities.
          2. "top_5_opportunities": A ranked list of 5 investment strategies.
          Each strategy must include:
          - "rank": 1 to 5.
          - "problem_summary": Specific geopolitical/environmental problem causing the opportunity.
          - "target_industry": The industry poised for massive growth or disruption.
          - "tickers": [{ "symbol": "Stock Ticker", "company": "Full Name", "rationale": "Direct link between crisis and company growth" }] (3-4 tickers).
          - "projected_upside": e.g. "+45% in 18M".
          - "confidence_score": 0.1 to 0.99.
          - "time_horizon": e.g. "Long-term (3-5 years)".
          - "risk_rating": "low", "moderate", "high", or "extreme".
      - TOPICS: Biosecurity, Deep Sea Mining, Orbital Conflict, Undersea Cyber Sabotage, Water Wars, Synthetic Biology leaks.
      
      OUTPUT FORMAT: JSON with "signals", "threat_nodes", and "global_investment_intelligence" objects.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const data = JSON.parse(response.text || "{}");
      if (data.signals) setSignals(data.signals);
      if (data.threat_nodes) setThreatNodes(data.threat_nodes);
      if (data.global_investment_intelligence) setGlobalIntel(data.global_investment_intelligence);
      
    } catch (error) {
      console.error("PIPELINE_ERROR:", error);
    } finally {
      clearInterval(interval);
      setScanProgress(100);
      setTimeout(() => setIsScanning(false), 300);
    }
  };

  const getCount = (status: string) => [...signals, ...threatNodes].filter(s => s.status === status).length;

  const allNodesSorted = useMemo(() => {
    const combined = [...signals, ...threatNodes];
    return combined.sort((a, b) => {
      const priority = { red: 3, yellow: 2, white: 1, green: 0 };
      return priority[b.status as keyof typeof priority] - priority[a.status as keyof typeof priority];
    });
  }, [signals, threatNodes]);

  return (
    <div className="flex h-screen bg-[#05080c] text-[#e2e8f0] overflow-hidden font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(195,211,51,0.01),_transparent_100%)] pointer-events-none" />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0 bg-transparent z-10 relative">
        {activeTab === 'map' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="relative flex-1 bg-[#05080c] overflow-hidden group/map">
              <WorldMap 
                signals={signals} 
                threatNodes={threatNodes}
                rawEvents={[]} 
                selectedItem={selectedItem} 
                onSelectItem={setSelectedItem}
                onOpenHistory={(item) => {
                  setSelectedItem(item);
                  setActiveTab('history');
                }}
              />

              <div className="absolute top-8 left-10 flex flex-col gap-1 pointer-events-none">
                <h2 className="text-xl font-black text-white tracking-tighter uppercase italic font-mono-tactical pointer-events-auto">Deep Strata Intelligence</h2>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em]">ALPHA CAPTURE ACTIVE • {signals.length + threatNodes.length} VECTORS</p>
              </div>

              <div className="absolute bottom-10 left-10 pointer-events-auto">
                <button 
                  onClick={runIntelligencePipeline}
                  disabled={isScanning}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all backdrop-blur-md
                    ${isScanning ? 'bg-white/5 text-gray-500 border border-white/10' : 'bg-[#c3d333]/90 text-[#05080c] shadow-2xl shadow-[#c3d333]/20 border border-white/20 hover:scale-105 active:scale-95'}`}
                >
                  {isScanning ? <RefreshCw size={12} className="animate-spin" /> : <Radar size={12} />}
                  {isScanning ? `EXTRACTING ALPHA ${scanProgress}%` : "RE-SCAN & CAPTURE ALPHA"}
                </button>
              </div>

              {isScanning && (
                <div className="absolute inset-0 z-[60] bg-[#05080c]/80 backdrop-blur-xl flex flex-col items-center justify-center">
                   <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-[#c3d333] transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                   </div>
                   <p className="text-[10px] font-black text-[#c3d333] uppercase tracking-[0.6em] animate-pulse text-center">DERIVING MACRO-FINANCIAL ALPHA<br/><span className="text-[8px] text-white/40">CALCULATING INVESTMENT PREDICTIONS & INDUSTRY SHIFTS</span></p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide bg-[#05080c]">
            <header className="flex items-center justify-between px-10 py-8 border-b border-white/[0.05] sticky top-0 bg-[#05080c]/80 backdrop-blur-xl z-20">
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic font-mono-tactical">
                  {activeTab === 'solutions' ? 'Resolution Hub' : activeTab === 'threats' ? 'Threat Registry' : activeTab === 'sources' ? 'Acquisition & Alpha' : activeTab === 'risk' ? 'Risk Analytics' : 'Temporal Analysis'}
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">
                  {selectedItem ? `FOCUSED ANALYSIS: ${selectedItem.region_id}` : 'GLOBAL SYNCHRONIZED REPOSITORY'}
                </p>
              </div>
              <div className="flex gap-4">
                {selectedItem && (
                   <button 
                     onClick={() => setSelectedItem(null)}
                     className="px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400"
                   >
                     Clear Context
                   </button>
                )}
                <button 
                  onClick={runIntelligencePipeline}
                  disabled={isScanning}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] bg-[#c3d333]/10 border border-[#c3d333]/20 text-[#c3d333] hover:bg-[#c3d333]/20 transition-all"
                >
                  <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
                  SYNC ALL
                </button>
              </div>
            </header>

            <div className="px-10 py-10">
              {activeTab === 'solutions' ? (
                <SolutionView 
                  item={selectedItem} 
                  allItems={allNodesSorted} 
                  onSelectItem={setSelectedItem} 
                />
              ) : activeTab === 'threats' ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {threatNodes.map(tn => (
                    <div key={tn.threat_node_id} className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] hover:border-red-500/30 transition-all group cursor-pointer" onClick={() => { setActiveTab('map'); setSelectedItem(tn); }}>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-4 rounded-2xl ${tn.status === 'red' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                             <Flame size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">{tn.threat_type.replace(/_/g, ' ')}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{tn.region_id}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400 italic text-sm leading-relaxed mb-6 border-l-2 border-red-500/20 pl-4">
                        {tn.analysis?.risk_posture || tn.persistence_reason}
                      </p>
                      <div className="text-[10px] font-mono-tactical text-gray-600 uppercase pt-6 border-t border-white/5 flex justify-between">
                         <span>ACTIVE SINCE: {tn.active_since}</span>
                         <span className="text-red-500">INTENSITY: {tn.intensity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeTab === 'sources' ? (
                <div className="space-y-16">
                   <InvestmentIntelligence intelligence={globalIntel} />
                   
                   <div className="space-y-8">
                     <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] border-l-2 border-[#c3d333] pl-4">Raw Node Acquisition Plans</h3>
                     <div className="grid grid-cols-1 gap-8">
                        {(selectedItem ? [selectedItem] : allNodesSorted).filter(n => n.analysis?.acquisition_plan).map((node, i) => {
                           const isSig = 'signal_id' in node;
                           const plan: AcquisitionPlan = {
                              region_id: isSig ? node.headline || node.region_id : node.threat_type.replace(/_/g, ' '),
                              strategic_weight: isSig ? node.strategic_weight : 4,
                              baseline_sources: node.analysis?.acquisition_plan?.baseline_sources || [],
                              event_sources: node.analysis?.acquisition_plan?.event_sources || [],
                              ambiguity_sources: node.analysis?.acquisition_plan?.ambiguity_sources || [],
                              silence_watch: {
                                 expected_signal: node.analysis?.acquisition_plan?.expected_signal || 'Pulse trace',
                                 max_gap_hours: node.analysis?.acquisition_plan?.max_gap_hours || 24
                              },
                              coverage_status: node.status === 'red' ? 'insufficient' : 'sufficient'
                           };
                           return <AcquisitionPlanCard key={i} plan={plan} />;
                        })}
                     </div>
                   </div>
                </div>
              ) : activeTab === 'risk' ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Warfare / Crisis" value={getCount('red')} icon={<AlertTriangle size={20} className="text-red-500" />} detail="High-intensity kinetic/failure" />
                    <StatCard label="Escalating Tension" value={getCount('yellow')} icon={<Zap size={20} className="text-amber-500" />} detail="Directional shift detected" />
                    <StatCard label="Persistent Threats" value={threatNodes.length} icon={<Flame size={20} className="text-red-400" />} detail="Ongoing hostility" />
                    <StatCard label="Structural Decay" value={getCount('white')} icon={<Clock size={20} className="text-white" />} detail="Long-term cumulative decay" />
                  </div>
                  <RiskAnalytics signals={signals} />
                  <EconomicImpactAnalysis signals={signals} threatNodes={threatNodes} />
                </div>
              ) : activeTab === 'history' ? (
                <HistoryView item={selectedItem} onBack={() => setActiveTab('map')} />
              ) : (
                <div className="flex items-center justify-center py-40">
                   <p className="text-gray-600 font-black uppercase tracking-[0.5em] text-xs">Ready for Analysis</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;