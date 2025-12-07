export const getFoodCompatibility = (food, userDosha) => {
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
    let compatibility = 'neutral';
    let message = `Neutral for your ${userDosha} type.`;
    if (userScore < -1) {
        compatibility = 'good';
        message = `✓ Excellent for your ${userDosha} type! ${food.recommendations}`;
    }
    else if (userScore < 0) {
        compatibility = 'good';
        message = `✓ Good for your ${userDosha} type. ${food.recommendations}`;
    }
    else if (userScore === 0) {
        compatibility = 'neutral';
        message = `○ Neutral for your ${userDosha} type. ${food.recommendations}`;
    }
    else if (userScore <= 1) {
        compatibility = 'neutral';
        message = `○ Slightly heavy for ${userDosha}. Enjoy in moderation. ${food.recommendations}`;
    }
    else {
        compatibility = 'avoid';
        message = `✗ May aggravate ${userDosha}. Consider alternatives or balance with cooling foods.`;
    }
    return { food, compatibility, message };
};
export const calculatePortionSize = (dosha) => {
    const portions = {
        Vata: '150-200g (small portions, frequent meals)',
        Pitta: '150-200g (cool environment, cooling sides)',
        Kapha: '100-150g (stimulating spices, light meals)',
    };
    return dosha && portions[dosha]
        ? portions[dosha]
        : 'Standard portion: 150-200g';
};
export const getThermicQualityDescription = (quality) => {
    const descriptions = {
        heating: 'Heating foods increase warmth and stimulate digestion. Good for Vata and Kapha.',
        cooling: 'Cooling foods reduce excess heat and calm inflammation. Perfect for Pitta.',
        neutral: 'Neutral foods balance all doshas when prepared appropriately.',
    };
    return descriptions[quality] || '';
};
export const getRecommendedTime = (bestTime) => {
    if (bestTime.includes('breakfast'))
        return '🌅 Best for breakfast';
    if (bestTime.includes('lunch'))
        return '☀️ Best for lunch';
    if (bestTime.includes('dinner'))
        return '🌙 Best for dinner';
    if (bestTime.includes('snack'))
        return '🥤 Good as a snack';
    return '⏰ Flexible timing';
};
