import React, { useState } from 'react';
import { User } from 'firebase/auth';

interface HeaderProps {
  onFindServices: () => void;
  onListBusiness: () => void;
  onMyBusinesses: () => void;
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onFindServices, onListBusiness, onMyBusinesses, user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <>
      {/* Header Desktop */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm hidden md:block">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-xl font-black text-slate-900 italic">SELL<span className="text-emerald-600">QUICK</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <button onClick={onFindServices} className="text-sm font-semibold text-slate-600 hover:text-emerald-600">Find Services</button>
              <button className="text-sm font-semibold text-slate-600 hover:text-emerald-600">Market Insights</button>
              <button className="text-sm font-semibold text-slate-600 hover:text-emerald-600">Verify Business</button>
              <button onClick={onMyBusinesses} className="text-sm font-semibold text-slate-600 hover:text-emerald-600">My Businesses</button>
              <button onClick={onListBusiness} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 transition">List Your Business</button>
            </nav>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{user.email}</span>
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user.email}</p>
                      <p className="text-xs text-slate-500">Logged in</p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-slate-500">Not logged in</div>
            )}
          </div>
        </div>
      </header>

      {/* Header Mobile */}
      <header className="bg-white p-4 border-b border-slate-200 sticky top-0 z-50 md:hidden flex justify-between items-center">
        <h1 className="text-lg font-black text-slate-900 italic">SELL<span className="text-emerald-600">QUICK</span></h1>
        <button className="p-2 bg-slate-100 rounded-lg">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
        </button>
      </header>
    </>
  );
};
