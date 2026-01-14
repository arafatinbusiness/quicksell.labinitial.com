import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const seedBusinesses = [
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
    hasMemberDiscount: true
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
    hasMemberDiscount: false
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
    hasMemberDiscount: true
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
    hasMemberDiscount: true
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
    hasMemberDiscount: false
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
    hasMemberDiscount: true
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
    hasMemberDiscount: false
  }
];

const seedFirestore = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'businesses'));
    if (snapshot.size > 0) {
      console.log('Firestore already has data, skipping seed.');
      return;
    }
    console.log('Seeding Firestore with sample businesses...');
    for (const business of seedBusinesses) {
      await addDoc(collection(db, 'businesses'), business);
    }
    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error seeding Firestore:', error);
  }
};

// Run if this script is executed directly
if (require.main === module) {
  seedFirestore();
}

export default seedFirestore;
