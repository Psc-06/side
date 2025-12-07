import React, { useMemo } from 'react';
import type { FoodItem, UserProfile } from '../types';
import {
  getFoodCompatibility,
  getThermicQualityDescription,
  calculatePortionSize,
} from '../utils/ayurvedaCalculations';
import '../styles/Report.css';

interface ReportProps {
  food: FoodItem | null;
  userProfile: UserProfile;
  onNavigate: (page: 'home' | 'scanner' | 'report' | 'browse' | 'recommendations') => void;
}

const Report: React.FC<ReportProps> = ({ food, userProfile, onNavigate }) => {
  if (!food) {
    return (
      <div className="report-container">
        <div className="report-header">
          <button className="back-button" onClick={() => onNavigate('scanner')}>
            ← Back
          </button>
          <h1>No Food Selected</h1>
        </div>
        <p>Please scan or select a food first.</p>
      </div>
    );
  }

  const compatibility = useMemo(
    () => getFoodCompatibility(food, userProfile.dosha),
    [food, userProfile.dosha]
  );

  const macroTotal = food.carbs + food.protein + food.fats;
  const carbsPercent = (food.carbs / macroTotal) * 100;
  const proteinPercent = (food.protein / macroTotal) * 100;
  const fatsPercent = (food.fats / macroTotal) * 100;

  const getDoshaColor = (score: number) => {
    if (score < -1) return '#27ae60'; // Green - good
    if (score < 0) return '#3498db'; // Blue - okay
    if (score === 0) return '#95a5a6'; // Gray - neutral
    if (score <= 1) return '#f39c12'; // Orange - caution
    return '#e74c3c'; // Red - avoid
  };

  const getDoshaLabel = (score: number) => {
    if (score < -1) return 'Excellent';
    if (score < 0) return 'Good';
    if (score === 0) return 'Neutral';
    if (score <= 1) return 'Caution';
    return 'Avoid';
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <button className="back-button" onClick={() => onNavigate('scanner')}>
          ← Back
        </button>
        <h1>📊 Food Report</h1>
      </div>

      <div className="report-content">
        {/* Food Name and Description */}
        <div className="food-card">
          <h2 className="food-name">{food.name}</h2>
          <p className="food-description">{food.description}</p>
        </div>

        {/* Calories Overview */}
        <section className="calories-section">
          <div className="calories-card">
            <h3>Calories</h3>
            <div className="calories-display">
              <span className="calories-value">{food.calories}</span>
              <span className="calories-unit">kcal</span>
            </div>
            <p className="portion-info">
              Suggested Portion: {calculatePortionSize(userProfile.dosha)}
            </p>
          </div>
        </section>

        {/* Macronutrients */}
        <section className="macros-section">
          <h3>Nutritional Breakdown</h3>
          <div className="macro-chart">
            <div className="macro-bar">
              <div
                className="macro-segment carbs"
                style={{ width: `${carbsPercent}%` }}
                title={`Carbs: ${food.carbs}g`}
              ></div>
              <div
                className="macro-segment protein"
                style={{ width: `${proteinPercent}%` }}
                title={`Protein: ${food.protein}g`}
              ></div>
              <div
                className="macro-segment fats"
                style={{ width: `${fatsPercent}%` }}
                title={`Fats: ${food.fats}g`}
              ></div>
            </div>
          </div>

          <div className="macro-details">
            <div className="macro-item">
              <span className="macro-label">
                <span className="macro-dot carbs"></span> Carbs
              </span>
              <span className="macro-value">{food.carbs}g</span>
            </div>
            <div className="macro-item">
              <span className="macro-label">
                <span className="macro-dot protein"></span> Protein
              </span>
              <span className="macro-value">{food.protein}g</span>
            </div>
            <div className="macro-item">
              <span className="macro-label">
                <span className="macro-dot fats"></span> Fats
              </span>
              <span className="macro-value">{food.fats}g</span>
            </div>
          </div>
        </section>

        {/* Thermic Quality */}
        <section className="thermic-section">
          <h3>Thermic Quality</h3>
          <div className="thermic-badge">
            <p>{getThermicQualityDescription(food.thermicQuality)}</p>
          </div>
        </section>

        {/* Ayurveda Impact */}
        <section className="ayurveda-section">
          <h3>Ayurveda Dosha Impact</h3>
          <div className="dosha-impact-grid">
            <div className="dosha-impact-item">
              <h4>Vata</h4>
              <div className="dosha-score-container">
                <div
                  className="dosha-indicator"
                  style={{ backgroundColor: getDoshaColor(food.vata) }}
                >
                  {getDoshaLabel(food.vata)}
                </div>
                <span className="score-value">{food.vata}</span>
              </div>
            </div>
            <div className="dosha-impact-item">
              <h4>Pitta</h4>
              <div className="dosha-score-container">
                <div
                  className="dosha-indicator"
                  style={{ backgroundColor: getDoshaColor(food.pitta) }}
                >
                  {getDoshaLabel(food.pitta)}
                </div>
                <span className="score-value">{food.pitta}</span>
              </div>
            </div>
            <div className="dosha-impact-item">
              <h4>Kapha</h4>
              <div className="dosha-score-container">
                <div
                  className="dosha-indicator"
                  style={{ backgroundColor: getDoshaColor(food.kapha) }}
                >
                  {getDoshaLabel(food.kapha)}
                </div>
                <span className="score-value">{food.kapha}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Body Type Recommendations */}
        {userProfile.dosha && (
          <section className="recommendation-section">
            <h3>Recommendation for Your {userProfile.dosha} Type</h3>
            <div
              className={`compatibility-message ${compatibility.compatibility}`}
            >
              <p>{compatibility.message}</p>
            </div>
          </section>
        )}

        {/* Best Time to Eat */}
        <section className="timing-section">
          <h3>Best Time to Eat</h3>
          <p className="timing-info">🕐 {food.bestTime}</p>
        </section>

        {/* Actionable Suggestions */}
        <section className="suggestions-section">
          <h3>Tips for Balanced Eating</h3>
          <ul className="suggestions-list">
            <li>✓ {food.recommendations}</li>
            <li>✓ Eat slowly and mindfully</li>
            <li>✓ Pair with seasonal vegetables</li>
            <li>✓ Consume during recommended meal times</li>
          </ul>
        </section>

        {/* Action Buttons */}
        <div className="report-actions">
          <button
            className="secondary-btn"
            onClick={() => onNavigate('scanner')}
          >
            Scan Another Food
          </button>
          <button className="primary-btn" onClick={() => onNavigate('browse')}>
            Browse More Foods
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
