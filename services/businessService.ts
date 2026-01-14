import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  doc, 
  updateDoc, 
  increment
} from 'firebase/firestore';
import { Business } from '../types';

const BUSINESSES_COLLECTION = 'businesses';

export const addBusiness = async (business: Omit<Business, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, BUSINESSES_COLLECTION), business);
    return docRef.id;
  } catch (error) {
    console.error('Error adding business: ', error);
    throw error;
  }
};

export const fetchBusinesses = async (filters?: {
  category?: string;
  microNiche?: string;
  budgetRange?: string;
  location?: string;
  verificationLevel?: number;
  ownerUid?: string;
  limit?: number;
  startAfterDoc?: any;
}): Promise<Business[]> => {
  try {
    let q: any = collection(db, BUSINESSES_COLLECTION);
    const constraints: any[] = [];
    
    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters?.microNiche) {
      constraints.push(where('microNiche', '==', filters.microNiche));
    }
    if (filters?.budgetRange) {
      constraints.push(where('budgetRange', '==', filters.budgetRange));
    }
    if (filters?.location) {
      constraints.push(where('location', '==', filters.location));
    }
    if (filters?.verificationLevel) {
      constraints.push(where('verificationLevel', '==', filters.verificationLevel));
    }
    if (filters?.ownerUid) {
      constraints.push(where('ownerUid', '==', filters.ownerUid));
    }
    
    // Default ordering: verificationLevel descending, then random? We'll implement rotation later.
    constraints.push(orderBy('verificationLevel', 'desc'));
    // constraints.push(orderBy('createdAt', 'desc')); // TODO: Add createdAt field
    
    if (filters?.limit) {
      constraints.push(limit(filters.limit));
    }
    if (filters?.startAfterDoc) {
      constraints.push(startAfter(filters.startAfterDoc));
    }
    
    q = query(q, ...constraints);
    const querySnapshot = await getDocs(q);
    const businesses: Business[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Business;
      businesses.push({ 
        id: docSnap.id, 
        ...data
      });
    });
    return businesses;
  } catch (error) {
    console.error('Error fetching businesses: ', error);
    throw error;
  }
};

export const fetchBusinessById = async (id: string): Promise<Business | null> => {
  try {
    const docRef = doc(db, BUSINESSES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Business;
      return {
        id: docSnap.id,
        ...data
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching business: ', error);
    throw error;
  }
};

export const incrementVouchCount = async (businessId: string): Promise<void> => {
  try {
    const businessRef = doc(db, BUSINESSES_COLLECTION, businessId);
    await updateDoc(businessRef, {
      vouchCount: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing vouch count: ', error);
    throw error;
  }
};

export const updateBusiness = async (businessId: string, updates: Partial<Business>): Promise<void> => {
  try {
    const businessRef = doc(db, BUSINESSES_COLLECTION, businessId);
    await updateDoc(businessRef, updates);
  } catch (error) {
    console.error('Error updating business: ', error);
    throw error;
  }
};

export const updateVerificationLevel = async (businessId: string, level: 1 | 2 | 3): Promise<void> => {
  try {
    const businessRef = doc(db, BUSINESSES_COLLECTION, businessId);
    await updateDoc(businessRef, {
      verificationLevel: level
    });
  } catch (error) {
    console.error('Error updating verification level: ', error);
    throw error;
  }
};

export const fetchDistinctCategories = async (): Promise<string[]> => {
  try {
    const businesses = await fetchBusinesses();
    const categories = businesses.map(b => b.category);
    // Remove duplicates
    return Array.from(new Set(categories));
  } catch (error) {
    console.error('Error fetching distinct categories:', error);
    return [];
  }
};

export const seedIfEmpty = async (): Promise<void> => {
  try {
    const businesses = await fetchBusinesses();
    if (businesses.length === 0) {
      console.log('No businesses found, seeding massive dataset...');
      const seedBusinesses: Omit<Business, 'id'>[] = [
        {
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
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
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
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
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
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Legal Eagles',
          category: 'Legal',
          microNiche: 'Startup Incorporation',
          description: 'Specialized legal services for tech startups and small businesses.',
          budgetRange: 'High',
          rating: 4.7,
          contact: 'legal@eagles.com',
          location: 'Silicon Valley',
          vouchCount: 12,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Tech Support Pro',
          category: 'Tech Support',
          microNiche: '24/7 Remote IT Support',
          description: 'Round-the-clock IT support for businesses of all sizes.',
          budgetRange: 'Medium',
          rating: 4.5,
          contact: 'support@techpro.com',
          location: 'Remote',
          vouchCount: 5,
          verificationLevel: 2,
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
          name: 'Digital Marketing Gurus',
          category: 'Marketing',
          microNiche: 'Social Media Advertising',
          description: 'Maximize your ROI with targeted social media campaigns.',
          budgetRange: 'High',
          rating: 4.9,
          contact: 'hello@dm-gurus.com',
          location: 'Los Angeles',
          vouchCount: 20,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Portrait Photography Studio',
          category: 'Photography',
          microNiche: 'Corporate Headshots',
          description: 'Professional headshot photography for corporate teams.',
          budgetRange: 'Medium',
          rating: 4.6,
          contact: 'studio@portrait.com',
          location: 'Chicago',
          vouchCount: 7,
          verificationLevel: 2,
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
          name: 'Green Thumb Landscaping',
          category: 'Landscaping',
          microNiche: 'Xeriscape Design',
          description: 'Water‑wise landscaping for arid climates. Native plants, drip irrigation, sustainable design.',
          budgetRange: 'Medium',
          rating: 4.7,
          contact: 'info@greenthumb.com',
          location: 'Phoenix',
          vouchCount: 9,
          verificationLevel: 2,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Precision HVAC Solutions',
          category: 'HVAC',
          microNiche: 'Commercial Refrigeration',
          description: 'Installation and maintenance of commercial refrigeration systems for restaurants and grocery stores.',
          budgetRange: 'High',
          rating: 4.8,
          contact: 'service@precisionhvac.com',
          location: 'Houston',
          vouchCount: 14,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'CodeCraft Developers',
          category: 'Software Development',
          microNiche: 'FinTech APIs',
          description: 'Building secure, scalable APIs for financial technology applications.',
          budgetRange: 'High',
          rating: 4.9,
          contact: 'dev@codecraft.com',
          location: 'San Francisco',
          vouchCount: 22,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Fresh Bites Catering',
          category: 'Catering',
          microNiche: 'Vegan & Gluten‑Free Events',
          description: 'Gourmet plant‑based catering for corporate events and weddings.',
          budgetRange: 'Medium',
          rating: 4.6,
          contact: 'events@freshbites.com',
          location: 'Portland',
          vouchCount: 6,
          verificationLevel: 2,
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
          name: 'SecureLock Locksmiths',
          category: 'Security',
          microNiche: 'High‑Security Commercial Locks',
          description: 'Installation of biometric and electronic access systems for office buildings.',
          budgetRange: 'High',
          rating: 4.7,
          contact: 'secure@securelock.com',
          location: 'Miami',
          vouchCount: 11,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Urban Fit Personal Training',
          category: 'Fitness',
          microNiche: 'Post‑Rehabilitation Training',
          description: 'One‑on‑one training for clients recovering from injuries or surgeries.',
          budgetRange: 'Medium',
          rating: 4.8,
          contact: 'train@urbanfit.com',
          location: 'Denver',
          vouchCount: 8,
          verificationLevel: 2,
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
          name: 'Bright Minds Tutoring',
          category: 'Education',
          microNiche: 'STEM Test Prep',
          description: 'Specialized tutoring for advanced placement math, physics, and computer science exams.',
          budgetRange: 'Medium',
          rating: 4.9,
          contact: 'tutor@brightminds.com',
          location: 'Boston',
          vouchCount: 13,
          verificationLevel: 2,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Clean Sweep Janitorial',
          category: 'Cleaning',
          microNiche: 'Medical Facility Sanitization',
          description: 'Deep cleaning and disinfection for clinics, dental offices, and laboratories.',
          budgetRange: 'Low',
          rating: 4.4,
          contact: 'clean@cleansweep.com',
          location: 'Atlanta',
          vouchCount: 4,
          verificationLevel: 1,
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
          name: 'Audio Visual Pros',
          category: 'Event Production',
          microNiche: 'Large‑Scale Conference AV',
          description: 'Full‑service audio‑visual production for conferences, trade shows, and corporate meetings.',
          budgetRange: 'High',
          rating: 4.8,
          contact: 'av@avpros.com',
          location: 'Las Vegas',
          vouchCount: 17,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Pet Paradise Grooming',
          category: 'Pet Care',
          microNiche: 'Show‑Dog Grooming',
          description: 'Professional grooming for competition dogs, including breed‑specific styling.',
          budgetRange: 'Medium',
          rating: 4.7,
          contact: 'grooming@petparadise.com',
          location: 'Orlando',
          vouchCount: 9,
          verificationLevel: 2,
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
          name: 'Solar Energy Solutions',
          category: 'Renewable Energy',
          microNiche: 'Residential Solar + Battery Storage',
          description: 'Turnkey solar panel installation with integrated battery backup systems.',
          budgetRange: 'High',
          rating: 4.9,
          contact: 'solar@solarenergy.com',
          location: 'San Diego',
          vouchCount: 19,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Quick Fix Plumbing',
          category: 'Plumbing',
          microNiche: 'Emergency Leak Repair',
          description: '24/7 emergency plumbing service for residential and commercial leaks.',
          budgetRange: 'Medium',
          rating: 4.5,
          contact: 'plumbing@quickfix.com',
          location: 'Dallas',
          vouchCount: 7,
          verificationLevel: 2,
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
          name: 'Global Logistics Partners',
          category: 'Logistics',
          microNiche: 'Cold‑Chain Shipping',
          description: 'Temperature‑controlled shipping for pharmaceuticals and perishable goods.',
          budgetRange: 'High',
          rating: 4.8,
          contact: 'logistics@global.com',
          location: 'Seattle',
          vouchCount: 15,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Mindful Therapy Collective',
          category: 'Mental Health',
          microNiche: 'Corporate Wellness Programs',
          description: 'On‑site and virtual therapy sessions for employee mental‑health initiatives.',
          budgetRange: 'Medium',
          rating: 4.9,
          contact: 'therapy@mindful.com',
          location: 'Austin',
          vouchCount: 12,
          verificationLevel: 2,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Bespoke Interior Design',
          category: 'Interior Design',
          microNiche: 'Luxury Hotel & Resort Design',
          description: 'Full‑service interior design for high‑end hospitality projects.',
          budgetRange: 'High',
          rating: 4.9,
          contact: 'design@bespoke.com',
          location: 'New York',
          vouchCount: 18,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        },
        {
          name: 'Mobile Auto Detailing',
          category: 'Automotive',
          microNiche: 'Ceramic Coating Application',
          description: 'On‑site ceramic coating and paint protection for luxury and classic cars.',
          budgetRange: 'Medium',
          rating: 4.7,
          contact: 'detail@mobileauto.com',
          location: 'Los Angeles',
          vouchCount: 10,
          verificationLevel: 2,
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
          name: 'Voiceover Studio',
          category: 'Media',
          microNiche: 'Multilingual Voiceover',
          description: 'Professional voiceover recording in 10+ languages for commercials, e‑learning, and animation.',
          budgetRange: 'Medium',
          rating: 4.6,
          contact: 'voice@studio.com',
          location: 'Remote',
          vouchCount: 6,
          verificationLevel: 2,
          hasMemberDiscount: false,
          ownerUid: 'seed'
        },
        {
          name: 'Cybersecurity Shield',
          category: 'Cybersecurity',
          microNiche: 'Penetration Testing',
          description: 'Comprehensive security assessments and penetration testing for financial institutions.',
          budgetRange: 'High',
          rating: 4.9,
          contact: 'security@shield.com',
          location: 'Washington DC',
          vouchCount: 21,
          verificationLevel: 3,
          hasMemberDiscount: true,
          ownerUid: 'seed'
        }
      ];
      for (const business of seedBusinesses) {
        await addBusiness(business);
      }
      console.log('Massive seed completed.');
    }
  } catch (error) {
    console.error('Error seeding Firestore:', error);
  }
};
