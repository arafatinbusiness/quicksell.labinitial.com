
import React, { useState } from 'react';
import { analyzeBusiness } from '../services/geminiService';
import { Business } from '../types';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { addBusiness } from '../services/businessService';

interface Props {
  onAdd: (b: Business) => void;
}

export const BusinessForm: React.FC<Props> = ({ onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [authData, setAuthData] = useState({
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    contact: '',
    location: '',
    website: ''
  });

  const handleAuth = async () => {
    if (!authData.email || !authData.password) {
      alert('Please enter email and password');
      return;
    }
    try {
      if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, authData.email, authData.password);
      } else {
        await signInWithEmailAndPassword(auth, authData.email, authData.password);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      alert(`Authentication failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('Please sign up or log in first');
      return;
    }
    setLoading(true);
    try {
      const analysis = await analyzeBusiness(formData.name, formData.details);
      
      const newBusiness: Omit<Business, 'id'> = {
        name: formData.name,
        category: analysis.category || 'General',
        microNiche: analysis.microNiche || 'General Service',
        description: formData.details,
        budgetRange: (analysis.budgetRange as any) || 'Medium',
        rating: 4.5,
        contact: formData.contact,
        location: formData.location,
        website: formData.website || undefined,
        analysis: analysis.analysis,
        trustScore: analysis.trustScore,
        vouchCount: 0,
        verificationLevel: 1,
        hasMemberDiscount: false,
        ownerUid: auth.currentUser.uid
      };
      const id = await addBusiness(newBusiness);
      onAdd({ ...newBusiness, id });
      setFormData({ name: '', details: '', contact: '', location: '', website: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-slate-900 italic">List Your <span className="text-emerald-600">Niche</span></h3>
        <p className="text-slate-500 text-sm mt-1">Our AI will index your specialty for instant matching.</p>
      </div>

      {/* Authentication Section */}
      <div className="mb-8 p-6 bg-slate-50 rounded-2xl">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-3 rounded-xl font-bold ${authMode === 'signup' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-3 rounded-xl font-bold ${authMode === 'login' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
          >
            Log In
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
            <input
              type="email"
              value={authData.email}
              onChange={e => setAuthData({...authData, email: e.target.value})}
              className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-emerald-500 outline-none transition-all font-bold"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
            <input
              type="password"
              value={authData.password}
              onChange={e => setAuthData({...authData, password: e.target.value})}
              className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-emerald-500 outline-none transition-all font-bold"
              placeholder="••••••••"
            />
          </div>
          <button
            type="button"
            onClick={handleAuth}
            className="w-full bg-slate-900 text-white py-4 px-4 rounded-2xl font-bold hover:bg-slate-800 transition"
          >
            {authMode === 'signup' ? 'Create Account' : 'Log In'}
          </button>
        </div>
        {auth.currentUser && (
          <div className="mt-4 text-center text-sm text-emerald-600 font-bold">
            ✅ Logged in as {auth.currentUser.email}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Company Name</label>
          <input
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-emerald-500 outline-none transition-all font-bold"
            placeholder="Sparkle Laundry Co."
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Niche Expertise</label>
          <textarea
            required
            value={formData.details}
            onChange={e => setFormData({...formData, details: e.target.value})}
            className="w-full rounded-2xl border-2 border-slate-100 p-4 h-32 focus:border-emerald-500 outline-none transition-all font-medium"
            placeholder="Describe your 1% specialty (e.g. 'We only clean luxury silk wedding dresses using ozone tech')..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Contact Signal</label>
            <input
              required
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
              className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-emerald-500 outline-none transition-all font-bold"
              placeholder="Email or Phone"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Base Operations</label>
            <input
              required
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-emerald-500 outline-none transition-all font-bold"
              placeholder="City/Area"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Website / Social Media (Optional)</label>
          <input
            type="url"
            value={formData.website}
            onChange={e => setFormData({...formData, website: e.target.value})}
            className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-emerald-500 outline-none transition-all font-bold"
            placeholder="https://example.com or social media profile"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !auth.currentUser}
          className="w-full bg-emerald-600 text-white py-5 px-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 disabled:opacity-50"
        >
          {loading ? 'AI AGENTS WORKING...' : 'ANALYZE & LIST'}
        </button>
      </div>
    </form>
  );
};
