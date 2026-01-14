
import React from 'react';
import { Business } from '../types';

export const HeatMap: React.FC<{ businesses: Business[] }> = ({ businesses }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-xl">🗺️</span> Pricing Heat Map
      </h4>
      <div className="relative h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,rgba(37,99,235,1)_0%,rgba(255,255,255,0)_70%)]" />
        {businesses.map((b, i) => (
          <div 
            key={b.id}
            className={`absolute w-3 h-3 rounded-full border border-white shadow-sm cursor-help ${
              b.budgetRange === 'High' ? 'bg-amber-500 scale-125' : 
              b.budgetRange === 'Medium' ? 'bg-blue-500' : 'bg-emerald-500 scale-75'
            }`}
            style={{ 
              top: `${20 + (i * 17) % 60}%`, 
              left: `${15 + (i * 23) % 70}%` 
            }}
            title={`${b.name} - ${b.budgetRange} Budget`}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Budget</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" /> Standard</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full" /> Premium</span>
      </div>
    </div>
  );
};
