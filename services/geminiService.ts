
import { GoogleGenAI, Type } from "@google/genai";
import { Business } from "../types";

// Get API key from environment (works in both dev and prod)
const apiKey = typeof process !== 'undefined' && process.env?.API_KEY 
  ? process.env.API_KEY 
  : (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const mockAnalysis = (name: string, details: string): Partial<Business> => ({
  category: 'General',
  microNiche: 'General Service',
  budgetRange: 'Medium',
  analysis: `Mock analysis for ${name}: ${details.substring(0, 100)}...`,
  trustScore: 75
});

const mockCuration = (wizardAnswers: any, businesses: Business[]): { matchedIds: string[], logic: string } => {
  // Pick top 3 businesses by verification level
  const sorted = [...businesses].sort((a, b) => b.verificationLevel - a.verificationLevel).slice(0, 3);
  return {
    matchedIds: sorted.map(b => b.id),
    logic: `Mock curation: selected top ${sorted.length} businesses by verification level.`
  };
};

export const analyzeBusiness = async (name: string, details: string): Promise<Partial<Business>> => {
  // If no API key is available, use mock immediately
  if (!ai) {
    console.warn('No Gemini API key available, using mock analysis');
    return mockAnalysis(name, details);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this business: ${name}. Details: ${details}. 
      Define its MICRO-NICHE (e.g. 'Silk Specialists', 'Overnight Express', 'Bulk Commercial'). 
      Assign a trust score (1-100) based on detail depth.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            microNiche: { type: Type.STRING },
            budgetRange: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            analysis: { type: Type.STRING },
            trustScore: { type: Type.NUMBER }
          },
          required: ["category", "microNiche", "budgetRange", "analysis"]
        }
      }
    });
    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error) {
    console.warn('Gemini API error, using mock analysis:', error);
    return mockAnalysis(name, details);
  }
};

export const getCuration = async (
  wizardAnswers: any, 
  businesses: Business[]
): Promise<{ matchedIds: string[], logic: string }> => {
  // If no API key is available, use mock immediately
  if (!ai) {
    console.warn('No Gemini API key available, using mock curation');
    return mockCuration(wizardAnswers, businesses);
  }

  try {
    const context = JSON.stringify(businesses.map(b => ({
      id: b.id,
      niche: b.microNiche,
      tier: b.verificationLevel,
      budget: b.budgetRange
    })));

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `User Needs: ${JSON.stringify(wizardAnswers)}. 
      Filter these businesses: ${context}. 
      Pick the 3 best matches. Prioritize higher tiers but ensure niche relevance.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            logic: { type: Type.STRING }
          },
          required: ["matchedIds", "logic"]
        }
      }
    });
    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error) {
    console.warn('Gemini API error, using mock curation:', error);
    return mockCuration(wizardAnswers, businesses);
  }
};
