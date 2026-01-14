
import React, { useState } from 'react';
import { Business } from '../types';

interface Props {
  targets: Business[];
  onClose: () => void;
  onSubmit: (details: any) => void;
}

export const RFQModal: React.FC<Props> = ({ targets, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ details: '', budget: '', deadline: '' });

  const next = () => setStep(s => s + 1);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Request a Quote</h3>
            <p className="text-xs text-slate-400">Pinging {targets.length} service providers</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        
        <div className="p-8">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block font-semibold">What do you need done?</label>
              <textarea 
                className="w-full border rounded-xl p-3 h-32"
                placeholder="e.g. I have 5 silk suits that need delicate dry cleaning..."
                value={form.details}
                onChange={e => setForm({...form, details: e.target.value})}
              />
              <button onClick={next} disabled={!form.details} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50">Next</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block font-semibold">Your maximum budget ($)?</label>
              <input 
                type="number"
                className="w-full border rounded-xl p-3"
                placeholder="100"
                value={form.budget}
                onChange={e => setForm({...form, budget: e.target.value})}
              />
              <button onClick={next} disabled={!form.budget} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50">Next</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block font-semibold">By when do you need it?</label>
              <input 
                type="date"
                className="w-full border rounded-xl p-3"
                value={form.deadline}
                onChange={e => setForm({...form, deadline: e.target.value})}
              />
              <button 
                onClick={() => onSubmit(form)} 
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold"
              >
                Send Request to {targets.length} Businesses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
