import React from 'react';

interface CuratedMatchesHeaderProps {
  curationLogic: string;
  onResetSearch: () => void;
}

export const CuratedMatchesHeader: React.FC<CuratedMatchesHeaderProps> = ({
  curationLogic,
  onResetSearch,
}) => {
  return (
    <div className="bg-emerald-600 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Lead Routed Successfully!</h2>
        <p className="text-emerald-100 text-xs md:text-sm opacity-90 italic">"{curationLogic}"</p>
        <button onClick={onResetSearch} className="mt-4 text-xs font-bold border-b border-white pb-1">← Reset Search</button>
      </div>
    </div>
  );
};
