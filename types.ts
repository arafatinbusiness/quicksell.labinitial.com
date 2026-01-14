
export type BudgetType = 'Low' | 'Medium' | 'High';

export interface Business {
  id: string;
  name: string;
  category: string;
  microNiche: string; // The specific sub-specialty
  description: string;
  budgetRange: BudgetType;
  rating: number;
  contact: string;
  location: string;
  website?: string; // Optional website or social media URL
  vouchCount: number;
  verificationLevel: 1 | 2 | 3; // 1: Basic, 2: Vouched, 3: Verified
  hasMemberDiscount: boolean; // Tier 3 requirement
  coordinates?: { lat: number; lng: number };
  // AI generated fields
  analysis?: string;
  trustScore?: number;
  ownerUid?: string; // Firebase Auth UID of the user who created this business
}
