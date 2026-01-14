
import React, { useState } from 'react';

interface Props {
  categories: string[];
  onComplete: (answers: any) => void;
}

export const NeedsWizard: React.FC<Props> = ({ categories, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ category: '', priority: '', budget: 'Medium' });

  const priorities = ['Speed (Urgent)', 'High Quality (Specialist)', 'Bulk (Scaling)', 'Price (Value)'];

  const handleNext = (field: string, val: string) => {
    const newAnswers = { ...answers, [field]: val };
    setAnswers(newAnswers);
    if (step === 2) {
      onComplete(newAnswers);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-emerald-950 p-8 text-white">
        <h3 className="text-2xl font-black italic">SellQuick <span className="text-emerald-500">FastTrack</span></h3>
        <p className="text-emerald-400 text-sm mt-1">Eliminating competition to find your instant expert.</p>
      </div>
      
      <div className="p-8">
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-600' : 'bg-slate-100'}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h4 className="text-lg font-bold mb-4 text-slate-800">1. Select Industry</h4>
            <div className="grid grid-cols-2 gap-3">
              {categories.length > 0 ? (
                categories.map(c => (
                  <button 
                    key={c} 
                    onClick={() => handleNext('category', c)}
                    className="p-4 border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition text-left font-bold"
                  >
                    {c}
                  </button>
                ))
              ) : (
                <p className="col-span-2 text-slate-500 text-center py-4">No categories available yet. Add a business first.</p>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h4 className="text-lg font-bold mb-4 text-slate-800">2. Define Requirement</h4>
            <div className="grid grid-cols-1 gap-3">
              {priorities.map(p => (
                <button 
                  key={p} 
                  onClick={() => handleNext('priority', p)}
                  className="p-4 border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition text-left font-bold flex justify-between items-center"
                >
                  {p}
                  <span className="text-emerald-400">⚡</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h4 className="text-lg font-bold mb-4 text-slate-800">3. Select Budget Floor</h4>
            <div className="flex gap-4">
              {['Low', 'Medium', 'High'].map(b => (
                <button 
                  key={b} 
                  onClick={() => handleNext('budget', b)}
                  className="flex-1 p-6 border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition text-center font-black"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
