import React from 'react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  onQuickQuote: (business: Business) => void;
}

const getBadge = (b: Business) => {
  if (b.verificationLevel === 3) return <span className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">🛡️ VERIFIED</span>;
  if (b.verificationLevel === 2) return <span className="bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">✓ VOUCHED</span>;
  return <span className="text-slate-400 text-[9px] font-bold">BASIC</span>;
};

const ContactBar = ({ business }: { business: Business }) => {
  const waMsg = encodeURIComponent(`Hi ${business.name}, I found you on SellQuick. I'm interested in your ${business.microNiche} services.`);
  
  return (
    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
      <a href={`mailto:${business.contact}`} className="flex-1 flex items-center justify-center p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 group">
        <svg className="w-5 h-5 text-slate-500 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </a>
      <a href={`https://wa.me/1234567890?text=${waMsg}`} target="_blank" className="flex-1 flex items-center justify-center p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 group">
        <svg className="w-5 h-5 text-slate-500 group-hover:text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      {business.website && (
        <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 group">
          <svg className="w-5 h-5 text-slate-500 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </a>
      )}
      <a href="#" className="flex-1 flex items-center justify-center p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 group">
        <svg className="w-5 h-5 text-slate-500 group-hover:text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
    </div>
  );
};

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, onQuickQuote }) => {
  return (
    <div className={`p-0.5 rounded-[2rem] transition-all duration-300 ${business.verificationLevel === 3 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg' : 'bg-slate-200'}`}>
      <div className="bg-white p-5 md:p-6 rounded-[1.9rem] flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">{business.name}</h3>
              <div className="flex gap-2 items-center">{getBadge(business)}</div>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase">{business.budgetRange}</span>
          </div>
          <p className="text-emerald-600 text-xs font-bold mb-2">⚡ {business.microNiche}</p>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3 md:line-clamp-none">{business.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onQuickQuote(business)}
              className="flex-1 md:flex-none bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs hover:bg-slate-800 shadow-md"
            >
              Quick Quote
            </button>
            {business.hasMemberDiscount && (
              <div className="text-amber-600 text-[10px] font-black uppercase flex items-center gap-1">
                💰 10% Off
              </div>
            )}
          </div>
          <ContactBar business={business} />
        </div>
        <div className="hidden md:flex md:w-24 flex-col items-center justify-center border-l border-slate-100 pl-4">
          <p className="text-2xl font-black text-slate-900">{business.vouchCount}</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">Vouches</p>
        </div>
      </div>
    </div>
  );
};
