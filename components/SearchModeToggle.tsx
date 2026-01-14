import React from 'react';

interface SearchModeToggleProps {
  searchMode: 'wizard' | 'direct';
  onWizardClick: () => void;
  onDirectClick: () => void;
}

export const SearchModeToggle: React.FC<SearchModeToggleProps> = ({
  searchMode,
  onWizardClick,
  onDirectClick,
}) => {
  return (
    <div className="flex gap-2 p-1 bg-slate-200 rounded-2xl w-full md:w-fit overflow-x-auto no-scrollbar">
      <button 
        onClick={onWizardClick}
        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${searchMode === 'wizard' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
      >
        AI WIZARD
      </button>
      <button 
        onClick={onDirectClick}
        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${searchMode === 'direct' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
      >
        DIRECT SEARCH
      </button>
    </div>
  );
};
