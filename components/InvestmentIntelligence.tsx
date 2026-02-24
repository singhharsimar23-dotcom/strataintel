
import React from 'react';
import { GlobalInvestmentIntelligence } from '../types';
import { TrendingUp, Target, BarChart3, ShieldCheck, ArrowUpRight, Coins, Building2 } from 'lucide-react';

interface InvestmentIntelligenceProps {
  intelligence: GlobalInvestmentIntelligence | null;
}

const InvestmentIntelligence: React.FC<InvestmentIntelligenceProps> = ({ intelligence }) => {
  if (!intelligence) {
    return (
      <div className="p-20 text-center bg-[#0a0f18]/40 border border-dashed border-white/10 rounded-[3rem]">
        <Coins size={48} className="mx-auto text-gray-800 mb-6" />
        <p className="text-gray-600 font-black uppercase tracking-[0.5em] text-xs">Generating Global Alpha Analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-10 bg-[#c3d333]/5 border border-[#c3d333]/20 rounded-[3rem] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <Target size={20} className="text-[#c3d333]" />
          <h2 className="text-xs font-black text-white uppercase tracking-[0.4em]">Strategic Macro-Alpha Projection</h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-[#c3d333]/40 pl-6">
          {intelligence.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {intelligence.top_5_opportunities.map((opt) => (
          <div key={opt.rank} className="p-8 bg-[#0a0f18]/60 border border-white/10 rounded-[3rem] shadow-2xl backdrop-blur-xl group hover:border-[#c3d333]/40 transition-all">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Rank & Problem */}
              <div className="flex-1">
                <div className="flex items-center gap-6 mb-8">
                  <div className="text-5xl font-black text-[#c3d333]/20 font-mono-tactical">0{opt.rank}</div>
                  <div>
                    <span className="text-[10px] font-black text-[#c3d333] uppercase tracking-widest mb-1 block">Vector Analysis</span>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{opt.target_industry}</h3>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">Catalytic Crisis Profile</p>
                    <p className="text-[13px] text-gray-300 italic leading-relaxed">{opt.problem_summary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Projected Upside (12M)</p>
                      <div className="flex items-center gap-2">
                        <ArrowUpRight size={14} className="text-[#c3d333]" />
                        <span className="text-xl font-black text-white font-mono-tactical">{opt.projected_upside}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Confidence Score</p>
                      <div className="flex items-center gap-2 text-cyan-400">
                        <ShieldCheck size={14} />
                        <span className="text-xl font-black font-mono-tactical">{(opt.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tickers & Assets */}
              <div className="lg:w-[450px] space-y-4">
                <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Building2 size={14} className="text-[#c3d333]" /> Tactical Asset Allocation
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {opt.tickers.map((t) => (
                    <div key={t.symbol} className="p-5 bg-[#c3d333]/5 border border-[#c3d333]/10 rounded-2xl hover:bg-[#c3d333]/10 transition-all group/ticker">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-white font-mono-tactical px-2 py-1 bg-white/5 rounded-md border border-white/10 group-hover/ticker:border-[#c3d333]/30 transition-all">{t.symbol}</span>
                          <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">{t.company}</span>
                        </div>
                        <BarChart3 size={12} className="text-gray-600 group-hover/ticker:text-[#c3d333] transition-colors" />
                      </div>
                      <p className="text-[10px] text-gray-500 leading-snug group-hover/ticker:text-gray-300 transition-colors">
                        {t.rationale}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-600 uppercase">RISK:</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      opt.risk_rating === 'extreme' ? 'text-red-500' : 
                      opt.risk_rating === 'high' ? 'text-orange-500' : 
                      'text-amber-500'
                    }`}>{opt.risk_rating}</span>
                  </div>
                  <span className="text-[9px] font-mono-tactical text-gray-500 uppercase">HORIZON: {opt.time_horizon}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentIntelligence;
