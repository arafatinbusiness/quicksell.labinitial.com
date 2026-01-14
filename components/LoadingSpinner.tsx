import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[200] p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 italic">SELL<span className="text-emerald-600">QUICK</span> AI</h3>
        <p className="text-slate-500 text-sm mt-2 font-medium">Matching your niche at max velocity...</p>
      </div>
    </div>
  );
};
