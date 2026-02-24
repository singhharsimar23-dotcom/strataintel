
import React from 'react';
import { MAIN_NAV, BOTTOM_NAV } from '../constants';
import { Shield, LayoutGrid, Map as MapIcon, Database } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 flex flex-col h-screen bg-[#05080c] border-r border-[#1e293b] p-6 flex-shrink-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-9 h-9 flex items-center justify-center bg-[#c3d333]/10 rounded-lg border border-[#c3d333]/20 shadow-[0_0_15px_rgba(195,211,51,0.1)]">
          <Shield className="text-[#c3d333]" size={20} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-black tracking-[0.2em] text-white leading-tight uppercase">Situational</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Platform v5.0</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="px-2 mb-2">
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Operational Layers</span>
        </div>
        {MAIN_NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-xs font-bold transition-all border
              ${activeTab === item.id 
                ? 'bg-[#c3d333]/5 border-[#c3d333]/30 text-[#c3d333] shadow-[inset_0_0_10px_rgba(195,211,51,0.05)]' 
                : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'}`}
          >
            <span className={activeTab === item.id ? 'text-[#c3d333]' : 'text-gray-400'}>{item.icon}</span>
            <span className="uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-10 space-y-1 border-t border-[#1e293b]">
        {BOTTOM_NAV.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        <div className="mt-4 p-3 bg-[#c3d333]/5 border border-[#c3d333]/20 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-black text-[#c3d333] uppercase tracking-widest">Baseline Coverage</span>
            <span className="text-[8px] font-mono text-[#c3d333]">100%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-[100%] h-full bg-[#c3d333]" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
