import React, { useState, useEffect, useMemo } from 'react';
import { Business } from './types';
import { BusinessForm } from './components/BusinessForm';
import { NeedsWizard } from './components/NeedsWizard';
import { RFQModal } from './components/RFQModal';
import { SearchInterface } from './components/SearchInterface';
import { BusinessCard } from './components/BusinessCard';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SearchModeToggle } from './components/SearchModeToggle';
import { LoadingSpinner } from './components/LoadingSpinner';
import { CuratedMatchesHeader } from './components/CuratedMatchesHeader';
import { MyBusinesses } from './components/MyBusinesses';
import { getCuration } from './services/geminiService';
import { fetchBusinesses, addBusiness, fetchDistinctCategories, seedIfEmpty } from './services/businessService';
import { auth } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const App: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [view, setView] = useState<'register' | 'search' | 'map' | 'mybusinesses'>('search');
  const [searchMode, setSearchMode] = useState<'wizard' | 'direct'>('wizard');
  const [curatedMatches, setCuratedMatches] = useState<Business[]>([]);
  const [curationLogic, setCurationLogic] = useState('');
  const [loading, setLoading] = useState(false);
  const [rfqTargets, setRfqTargets] = useState<Business[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        // Ensure there is at least seed data in Firestore
        await seedIfEmpty();
        const businesses = await fetchBusinesses();
        setBusinesses(businesses);
        // Extract distinct categories from businesses
        const distinctCategories = Array.from(new Set(businesses.map(b => b.category)));
        setCategories(distinctCategories);
      } catch (error) {
        console.error('Failed to load businesses from Firestore:', error);
        // Fallback to seed data if Firestore fails
        const seed: Business[] = [
          {
            id: '1',
            name: 'Elite Fabric Care',
            category: 'Laundry',
            microNiche: 'Silk & Wedding Specialists',
            description: 'Luxury garment care since 1995. Specializing in high-end couture and delicate fabrics.',
            budgetRange: 'High',
            rating: 4.8,
            contact: 'ny@elite.com',
            location: 'Upper East Side',
            vouchCount: 15,
            verificationLevel: 3,
            hasMemberDiscount: true
          },
          {
            id: '2',
            name: 'Swift Wash Hub',
            category: 'Laundry',
            microNiche: 'Bulk Industrial Laundry',
            description: 'Commercial washing for retail clients. Fast turnaround for gyms and hotels.',
            budgetRange: 'Low',
            rating: 4.2,
            contact: 'hello@swift.com',
            location: 'Brooklyn',
            vouchCount: 3,
            verificationLevel: 1,
            hasMemberDiscount: false
          },
          {
            id: '3',
            name: 'Master Tailors',
            category: 'Tailoring',
            microNiche: 'Bespoke Suit Alterations',
            description: 'Expert repairs and luxury adjustments. Master tailors with 30 years experience.',
            budgetRange: 'Medium',
            rating: 4.9,
            contact: 'tailor@bespoke.com',
            location: 'Manhattan',
            vouchCount: 8,
            verificationLevel: 2,
            hasMemberDiscount: true
          }
        ];
        setBusinesses(seed);
        setCategories(['Laundry', 'Legal', 'Tech Support', 'Marketing', 'Photography']); // fallback
      }
    };
    loadBusinesses();
  }, []);

  const displayedBusinesses = useMemo(() => {
    if (curatedMatches.length > 0) return curatedMatches;
    return [...businesses].sort((a, b) => {
      if (b.verificationLevel !== a.verificationLevel) return b.verificationLevel - a.verificationLevel;
      return Math.random() - 0.5;
    });
  }, [businesses, curatedMatches]);

  const handleWizardComplete = async (answers: any) => {
    setLoading(true);
    try {
      const { matchedIds, logic } = await getCuration(answers, businesses);
      const matches = businesses.filter(b => matchedIds.includes(b.id));
      setCuratedMatches(matches);
      setCurationLogic(logic);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuote = (business: Business) => {
    setRfqTargets([business]);
  };

  const handleFindServices = () => {
    setCuratedMatches([]);
    setView('search');
  };

  const handleListBusiness = () => {
    setView('register');
  };

  const handleMyBusinesses = () => {
    setView('mybusinesses');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleViewChange = (newView: 'search' | 'map' | 'register' | 'insights' | 'mybusinesses') => {
    if (newView === 'insights') {
      // For now, just log; could be implemented later
      console.log(`Switching to ${newView}`);
      return;
    }
    setView(newView);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-10">
      <Header
        onFindServices={handleFindServices}
        onListBusiness={handleListBusiness}
        onMyBusinesses={handleMyBusinesses}
        user={user}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 mt-6 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            {view === 'register' ? (
              <BusinessForm onAdd={async (b) => { 
                try {
                  const id = await addBusiness(b);
                  setBusinesses([{ ...b, id }, ...businesses]); 
                  setView('search'); 
                } catch (error) {
                  console.error('Failed to add business:', error);
                  alert('Failed to add business. Please try again.');
                }
              }} />
            ) : view === 'map' ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
                  <p className="text-slate-500 font-medium">Interactive geographic clustering available soon.</p>
                </div>
              </div>
            ) : view === 'mybusinesses' ? (
              <MyBusinesses />
            ) : (
              <>
                <SearchModeToggle
                  searchMode={searchMode}
                  onWizardClick={() => { setSearchMode('wizard'); setCuratedMatches([]); }}
                  onDirectClick={() => { setSearchMode('direct'); setCuratedMatches([]); }}
                />

                {curatedMatches.length === 0 ? (
                  <div className="space-y-6 md:space-y-8">
                    {searchMode === 'wizard' ? (
                      <>
                        <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-lg">
                          <h2 className="text-xl md:text-2xl font-black">Low Competition. Higher ROI.</h2>
                          <p className="text-emerald-100 mt-2 text-sm md:text-base">We bypass the generic marketplace to route you directly to high-velocity experts.</p>
                        </div>
                        <NeedsWizard categories={categories} onComplete={handleWizardComplete} />
                      </>
                    ) : (
                      <SearchInterface businesses={businesses} />
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
                    <CuratedMatchesHeader
                      curationLogic={curationLogic}
                      onResetSearch={() => setCuratedMatches([])}
                    />

                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                      {displayedBusinesses.map(b => (
                        <BusinessCard
                          key={b.id}
                          business={b}
                          onQuickQuote={handleQuickQuote}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Sidebar businesses={businesses} />
        </div>
      </main>

      <MobileBottomNav
        currentView={view}
        onViewChange={handleViewChange}
      />

      {rfqTargets && (
        <RFQModal 
          targets={rfqTargets} 
          onClose={() => setRfqTargets(null)} 
          onSubmit={() => {
            setRfqTargets(null);
            alert("SellQuick Signal Sent! The provider has been alerted to prioritize your quote.");
          }} 
        />
      )}
      
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default App;
