import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { fetchBusinesses, updateBusiness } from '../services/businessService';
import { Business } from '../types';

export const MyBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Business>>({});

  useEffect(() => {
    loadMyBusinesses();
  }, []);

  const loadMyBusinesses = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const myBusinesses = await fetchBusinesses({ ownerUid: auth.currentUser.uid });
      setBusinesses(myBusinesses);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (business: Business) => {
    setEditingId(business.id);
    setEditForm({
      name: business.name,
      description: business.description,
      contact: business.contact,
      location: business.location,
      website: business.website,
      microNiche: business.microNiche,
      budgetRange: business.budgetRange,
    });
  };

  const handleSave = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await updateBusiness(id, editForm);
      setBusinesses(businesses.map(b => b.id === id ? { ...b, ...editForm } : b));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating business:', error);
      alert('Failed to update business. You may not have permission.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  if (!auth.currentUser) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-4xl mx-auto">
        <h3 className="text-2xl font-black text-slate-900 italic mb-4">My Businesses</h3>
        <p className="text-slate-600">Please sign in to view and edit your businesses.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-slate-900 italic">My Businesses</h3>
        <button
          onClick={loadMyBusinesses}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : businesses.length === 0 ? (
        <p className="text-slate-600">You haven't listed any businesses yet.</p>
      ) : (
        <div className="space-y-6">
          {businesses.map(business => (
            <div key={business.id} className="p-6 border border-slate-100 rounded-2xl">
              {editingId === business.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Company Name</label>
                    <input
                      value={editForm.name || ''}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full rounded-2xl border-2 border-slate-100 p-3 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      className="w-full rounded-2xl border-2 border-slate-100 p-3 h-24 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Contact</label>
                      <input
                        value={editForm.contact || ''}
                        onChange={e => setEditForm({...editForm, contact: e.target.value})}
                        className="w-full rounded-2xl border-2 border-slate-100 p-3 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Location</label>
                      <input
                        value={editForm.location || ''}
                        onChange={e => setEditForm({...editForm, location: e.target.value})}
                        className="w-full rounded-2xl border-2 border-slate-100 p-3 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Website</label>
                    <input
                      type="url"
                      value={editForm.website || ''}
                      onChange={e => setEditForm({...editForm, website: e.target.value})}
                      className="w-full rounded-2xl border-2 border-slate-100 p-3 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave(business.id)}
                      className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-slate-200 text-slate-800 py-3 rounded-xl font-bold hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{business.name}</h4>
                      <p className="text-emerald-600 text-sm font-bold">{business.microNiche}</p>
                      <p className="text-slate-600 text-sm mt-2">{business.description}</p>
                      <div className="flex gap-4 mt-3 text-sm text-slate-500">
                        <span>📞 {business.contact}</span>
                        <span>📍 {business.location}</span>
                        {business.website && <span>🌐 {business.website}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase">{business.budgetRange}</span>
                      <div className="mt-2">
                        <button
                          onClick={() => handleEdit(business)}
                          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-800"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
