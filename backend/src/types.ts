export interface FoodItem {
  id: number;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  vata: number;
  pitta: number;
  kapha: number;
  thermicQuality: "heating" | "cooling" | "neutral";
  bestTime: string;
  description: string;
  recommendations: string;
}

export type Dosha = "Vata" | "Pitta" | "Kapha";

export interface UserProfile {
  id?: number;
  userId: string;
  dosha: Dosha | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodReport {
  food: FoodItem;
  compatibility: "good" | "neutral" | "avoid";
  message: string;
}
