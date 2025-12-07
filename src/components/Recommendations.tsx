import React, { useMemo, useEffect, useState } from "react";
import type { FoodItem, UserProfile, FoodReport } from "../types";
import { apiClient } from "../utils/apiClient";
import "../styles/Recommendations.css";

interface RecommendationsProps {
  userProfile: UserProfile;
  onFoodSelected: (food: FoodItem) => void;
  onNavigate: (
    page: "home" | "scanner" | "report" | "browse" | "recommendations"
  ) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  userProfile,
  onFoodSelected,
  onNavigate,
}) => {
  const [recommendedFoods, setRecommendedFoods] = useState<FoodReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recommendations from API
  useEffect(() => {
    if (!userProfile.dosha) {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getRecommendations(userProfile.dosha!);
        setRecommendedFoods(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Failed to load recommendations.");
        setRecommendedFoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userProfile.dosha]);
  const doshaInfo = {
    Vata: {
      icon: "🌬️",
      color: "#8B4513",
      characteristics: "Light, Cold, Dry, Mobile - Needs grounding and warmth",
      foods:
        "Warm, oily, sweet, salty, and sour foods with spices like ginger, cumin, and cardamom",
      avoidFoods: "Raw, cold, light, and bitter foods",
      timing:
        "Eat warm meals at regular times to maintain stability and prevent anxiety",
    },
    Pitta: {
      icon: "🔥",
      color: "#DC143C",
      characteristics:
        "Hot, Sharp, Oily, Intense - Needs cooling and moderation",
      foods:
        "Cool, sweet, bitter, astringent foods with herbs like mint, cilantro, and coconut",
      avoidFoods:
        "Spicy, oily, salty, and acidic foods that overheat the system",
      timing:
        "Eat regular, cool meals to maintain balance and prevent irritation",
    },
    Kapha: {
      icon: "💧",
      color: "#4169E1",
      characteristics:
        "Heavy, Moist, Cold, Stable - Needs stimulation and lightness",
      foods:
        "Warm, light, spicy, bitter, astringent foods with stimulating spices like pepper and ginger",
      avoidFoods: "Heavy, oily, cold, sweet foods that increase sluggishness",
      timing:
        "Skip breakfast, eat light lunch, lighter dinner to maintain energy",
    },
  };

  const recommendedFoods_list = useMemo(() => {
    if (!userProfile.dosha) {
      return [];
    }
    return recommendedFoods.slice(0, 8).map((item) => item.food);
  }, [recommendedFoods, userProfile.dosha]);

  const handleFoodClick = (food: FoodItem) => {
    onFoodSelected(food);
    onNavigate("report");
  };

  if (!userProfile.dosha) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <button className="back-button" onClick={() => onNavigate("home")}>
            ← Back
          </button>
          <h1>💡 Recommendations</h1>
        </div>
        <div className="no-dosha-message">
          <p>
            Please set your body type first to get personalized recommendations.
          </p>
          <button className="primary-btn" onClick={() => onNavigate("home")}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const info = doshaInfo[userProfile.dosha];

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <button className="back-button" onClick={() => onNavigate("home")}>
          ← Back
        </button>
        <h1>💡 Recommendations</h1>
      </div>

      <div className="recommendations-content">
        {/* Dosha Profile */}
        <section className="dosha-profile" style={{ borderColor: info.color }}>
          <div className="profile-header">
            <span className="dosha-icon">{info.icon}</span>
            <h2>{userProfile.dosha} Body Type</h2>
          </div>

          <div className="profile-details">
            <div className="detail-card">
              <h4>Your Characteristics</h4>
              <p>{info.characteristics}</p>
            </div>

            <div className="detail-card">
              <h4>Best Foods for You</h4>
              <p>{info.foods}</p>
            </div>

            <div className="detail-card">
              <h4>Foods to Avoid</h4>
              <p>{info.avoidFoods}</p>
            </div>

            <div className="detail-card">
              <h4>Timing Tips</h4>
              <p>{info.timing}</p>
            </div>
          </div>
        </section>

        {/* Top Recommended Foods */}
        <section className="recommended-foods">
          <h3>Top {Math.min(8, recommendedFoods_list.length)} Foods for You</h3>
          <p className="section-subtitle">
            These foods naturally balance your {userProfile.dosha} dosha
          </p>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="loading-message">
              <p>Loading recommendations...</p>
            </div>
          ) : (
            <div className="recommended-grid">
              {recommendedFoods_list.map((food, index) => {
                return (
                  <div
                    key={food.id}
                    className="recommended-card"
                    onClick={() => handleFoodClick(food as FoodItem)}>
                    <div className="rank-badge">{index + 1}</div>
                    <h4>{food.name}</h4>
                    <p className="card-description">{food.description}</p>

                    <div className="card-stats">
                      <span className="stat-small">{food.calories} cal</span>
                      <span className="stat-small">{food.thermicQuality}</span>
                    </div>

                    <p className="card-benefit">✓ {food.recommendations}</p>
                    <button className="explore-btn">View Details →</button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Meal Planning */}
        <section className="meal-planning">
          <h3>Sample Daily Meal Plan for {userProfile.dosha}</h3>
          <div className="meal-plan">
            <div className="meal">
              <h4>🌅 Breakfast</h4>
              <p>Warm idli with sambhar and a cup of herbal tea</p>
            </div>
            <div className="meal">
              <h4>☀️ Lunch</h4>
              <p>Dal, rice, and seasonal vegetables with ghee</p>
            </div>
            <div className="meal">
              <h4>🌙 Dinner</h4>
              <p>Light khichdi or soup with warm bread</p>
            </div>
            <div className="meal">
              <h4>🥒 Snacks</h4>
              <p>Fresh fruits or nuts (as per your dosha)</p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="recommendations-actions">
          <button
            className="secondary-btn"
            onClick={() => onNavigate("browse")}>
            Browse All Foods
          </button>
          <button className="primary-btn" onClick={() => onNavigate("scanner")}>
            Scan Your Meal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
