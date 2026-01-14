
import React, { useState } from 'react';
import { getCuration } from '../services/geminiService';
import { Business } from '../types';

interface Props {
  businesses: Business[];
}

export const SearchInterface: React.FC<Props> = ({ businesses }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Business[]>([]);
  const [explanation, setExplanation] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await getCuration({ query }, businesses);
      const matchedBusinesses = businesses.filter(b => data.matchedIds.includes(b.id));
      setResults(matchedBusinesses);
      setExplanation(data.logic);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-200">
        <h3 className="text-2xl font-black mb-4 text-slate-900 italic">Direct <span className="text-emerald-600">Niche Access</span></h3>
        <p className="text-slate-500 text-sm mb-6">Describe your exact need. Our AI will bypass 10,000+ generalists to find your specific expert.</p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full rounded-2xl border-2 border-slate-100 pl-11 pr-4 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
              placeholder="e.g. 24-hour industrial laundry in Manhattan..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white py-4 px-8 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'FIND NOW'
            )}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl">
            <h4 className="font-bold text-emerald-800 mb-1 flex items-center gap-2">
              <span>🧠</span> AI Curation Insights
            </h4>
            <p className="text-sm text-emerald-700 italic leading-relaxed">"{explanation}"</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(biz => (
              <div key={biz.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition">{biz.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    biz.budgetRange === 'High' ? 'bg-purple-100 text-purple-700' :
                    biz.budgetRange === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {biz.budgetRange}
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-600 mb-3 uppercase tracking-tighter">⚡ {biz.microNiche}</p>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{biz.description}</p>
                <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-50">
                  <span className="flex items-center gap-1">📍 {biz.location}</span>
                  <span className="flex items-center gap-1">🏷️ {biz.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!loading && !results.length && query && (
        <div className="text-center py-10">
          <p className="text-slate-400 font-bold">No exact niche match found for "{query}".</p>
          <p className="text-slate-300 text-xs mt-1 uppercase tracking-widest">Try adjusting your industry or specific priority.</p>
        </div>
      )}
    </div>
  );
};
