import React from 'react';

interface MobileBottomNavProps {
  currentView: 'search' | 'map' | 'register' | 'insights' | 'mybusinesses';
  onViewChange: (view: 'search' | 'map' | 'register' | 'insights' | 'mybusinesses') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 h-20 flex items-center justify-between md:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <button onClick={() => onViewChange('search')} className={`flex flex-col items-center gap-1 ${currentView === 'search' ? 'text-emerald-600' : 'text-slate-400'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <span className="text-[10px] font-black uppercase">Search</span>
      </button>
      <button onClick={() => onViewChange('map')} className={`flex flex-col items-center gap-1 ${currentView === 'map' ? 'text-emerald-600' : 'text-slate-400'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l5-2.5 5.553 2.776a1 1 0 01.447.894v10.764a1 1 0 01-1.447.894L15 17l-6 3z"/></svg>
        <span className="text-[10px] font-black uppercase">Map</span>
      </button>
      <div className="relative -top-6">
        <button onClick={() => onViewChange('register')} className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
        </button>
      </div>
      <button onClick={() => onViewChange('insights')} className={`flex flex-col items-center gap-1 ${currentView === 'insights' ? 'text-emerald-600' : 'text-slate-400'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        <span className="text-[10px] font-black uppercase">Insights</span>
      </button>
      <button onClick={() => onViewChange('mybusinesses')} className={`flex flex-col items-center gap-1 ${currentView === 'mybusinesses' ? 'text-emerald-600' : 'text-slate-400'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        <span className="text-[10px] font-black uppercase">My Businesses</span>
      </button>
    </nav>
  );
};
