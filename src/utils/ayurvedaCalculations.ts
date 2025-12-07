import type { FoodItem, Dosha, FoodReport } from '../types';

export const getFoodCompatibility = (
  food: FoodItem,
  userDosha: Dosha | null
): FoodReport => {
  if (!userDosha) {
    return {
      food,
      compatibility: 'neutral',
      message: 'Set your body type to get personalized recommendations',
    };
  }

  const doshaScores = {
    Vata: food.vata,
    Pitta: food.pitta,
    Kapha: food.kapha,
  };

  const userScore = doshaScores[userDosha];

  let compatibility: 'good' | 'neutral' | 'avoid' = 'neutral';
  let message = `Neutral for your ${userDosha} type.`;

  if (userScore < -1) {
    compatibility = 'good';
    message = `✓ Excellent for your ${userDosha} type! ${food.recommendations}`;
  } else if (userScore < 0) {
    compatibility = 'good';
    message = `✓ Good for your ${userDosha} type. ${food.recommendations}`;
  } else if (userScore === 0) {
    compatibility = 'neutral';
    message = `○ Neutral for your ${userDosha} type. ${food.recommendations}`;
  } else if (userScore <= 1) {
    compatibility = 'neutral';
    message = `○ Slightly heavy for ${userDosha}. Enjoy in moderation. ${food.recommendations}`;
  } else {
    compatibility = 'avoid';
    message = `✗ May aggravate ${userDosha}. Consider alternatives or balance with cooling foods.`;
  }

  return { food, compatibility, message };
};

export const calculatePortionSize = (dosha: Dosha | null): string => {
  const portions = {
    Vata: '150-200g (small portions, frequent meals)',
    Pitta: '150-200g (cool environment, cooling sides)',
    Kapha: '100-150g (stimulating spices, light meals)',
  };

  return dosha && portions[dosha]
    ? portions[dosha]
    : 'Standard portion: 150-200g';
};

export const getThermicQualityDescription = (
  quality: 'heating' | 'cooling' | 'neutral'
): string => {
  const descriptions = {
    heating: '🔥 Heating - May increase Pitta',
    cooling: '❄️ Cooling - Balances Pitta',
    neutral: '⚖️ Neutral - Balanced thermal effect',
  };
  return descriptions[quality];
};
