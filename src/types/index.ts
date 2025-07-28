export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: 'free' | 'premium';
  planExpiry: Date;
  isAdmin: boolean;
  createdAt: Date;
  weights: WeightEntry[];
  achievements: Achievement[];
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: Date;
  notes?: string;
}

export interface Achievement {
  id: string;
  type: 'discipline' | 'transformation' | 'consistency';
  title: string;
  description: string;
  unlockedAt: Date;
}

export interface Recipe {
  id: string;
  name: string;
  category: 'vegana' | 'cetogenica' | 'lowcarb';
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  substitutions: string[];
  image: string;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BMIResult {
  bmi: number;
  classification: string;
  message: string;
  color: string;
}