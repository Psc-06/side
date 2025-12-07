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
  dosha: Dosha | null;
}

export interface FoodReport {
  food: FoodItem;
  compatibility: "good" | "neutral" | "avoid";
  message: string;
}

// NEW: pages used in navigation
export type Page =
  | "home"
  | "scanner"
  | "barcode-scanner"
  | "report"
  | "browse"
  | "recommendations"
  | "history"
  | "login"
  | "signup";

// NEW: scan history items
export interface ScanHistoryItem {
  _id?: string;
  userId: string;
  foodId: number;
  method: "barcode" | "photo" | "manual";
  barcode?: string | null;

  // denormalised info from backend
  foodName?: string;
  calories?: number;
  thermicQuality?: "heating" | "cooling" | "neutral";

  createdAt?: string;
}
