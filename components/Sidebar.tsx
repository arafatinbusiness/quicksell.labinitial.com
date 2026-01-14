import React from 'react';
import { Business } from '../types';
import { HeatMap } from './HeatMap';

interface SidebarProps {
  businesses: Business[];
}

export const Sidebar: React.FC<SidebarProps> = ({ businesses }) => {
  return (
    <div className="hidden lg:block lg:col-span-4 space-y-8">
      <HeatMap businesses={businesses} />
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h4 className="font-black text-slate-900 mb-4 uppercase tracking-tighter">Velocity Metrics</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-50 pb-2">
            <span className="text-xs text-slate-500 font-bold uppercase">Avg Contact Time</span>
            <span className="text-xl font-black text-emerald-600">42s</span>
          </div>
          <div className="flex justify-between items-end border-b border-slate-50 pb-2">
            <span className="text-xs text-slate-500 font-bold uppercase">Niche Accuracy</span>
            <span className="text-xl font-black text-emerald-600">98%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
