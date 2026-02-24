
import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  detail?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, detail }) => {
  return (
    <div className="flex-1 min-w-[200px] bg-[#111827]/40 rounded-2xl border border-white/5 p-6 stat-card-glow hover:bg-[#111827]/60 hover:border-[#c3d333]/20 transition-all cursor-default group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-[#c3d333] transition-colors duration-500" />
      
      <div className="flex items-start justify-between">
        <div className="p-3 bg-white/5 rounded-xl text-gray-500 group-hover:text-[#c3d333] group-hover:bg-[#c3d333]/5 transition-all duration-500">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-[9px] text-gray-500 font-black mb-2 uppercase tracking-[0.2em]">{label}</p>
          <span className="text-3xl font-black text-white font-mono-tactical tracking-tighter">{value}</span>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
           <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-1 h-2 rounded-full ${i <= 3 ? 'bg-[#c3d333]/20' : 'bg-white/5'}`} />
            ))}
            </div>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Integrity: High</span>
        </div>
        {detail && (
            <p className="text-[10px] text-gray-400 font-mono-tactical leading-tight italic truncate border-t border-white/5 pt-3 mt-2">
                <span className="text-[#c3d333] font-black mr-2">SOURCE:</span>{detail}
            </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
