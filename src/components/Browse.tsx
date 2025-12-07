import React, { useState, useMemo, useEffect } from "react";
import type { FoodItem, UserProfile } from "../types";
import { getFoodCompatibility } from "../utils/ayurvedaCalculations";
import { apiClient } from "../utils/apiClient";
import "../styles/Browse.css";

interface BrowseProps {
  userProfile: UserProfile;
  onFoodSelected: (food: FoodItem) => void;
  onNavigate: (
    page: "home" | "scanner" | "report" | "browse" | "recommendations"
  ) => void;
}

type SortOption = "name" | "calories" | "protein" | "compatibility";

const Browse: React.FC<BrowseProps> = ({
  userProfile,
  onFoodSelected,
  onNavigate,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterThermic, setFilterThermic] = useState<
    "all" | "heating" | "cooling" | "neutral"
  >("all");
  const [filterTime, setFilterTime] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch foods from API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getFoods();
        setFoods(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch foods:", err);
        setError("Failed to load foods. Please check your connection.");
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const filteredAndSortedFoods = useMemo(() => {
    let foodList = [...foods];

    // Search filter
    if (searchQuery) {
      foodList = foodList.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Thermic filter
    if (filterThermic !== "all") {
      foodList = foodList.filter(
        (food) => food.thermicQuality === filterThermic
      );
    }

    // Time filter
    if (filterTime !== "all") {
      foodList = foodList.filter((food) => food.bestTime.includes(filterTime));
    }

    // Sort
    switch (sortBy) {
      case "name":
        foodList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "calories":
        foodList.sort((a, b) => a.calories - b.calories);
        break;
      case "protein":
        foodList.sort((a, b) => b.protein - a.protein);
        break;
      case "compatibility":
        if (userProfile.dosha) {
          foodList.sort((a, b) => {
            const aScore =
              a[userProfile.dosha!.toLowerCase() as "vata" | "pitta" | "kapha"];
            const bScore =
              b[userProfile.dosha!.toLowerCase() as "vata" | "pitta" | "kapha"];
            return bScore - aScore;
          });
        }
        break;
    }

    return foodList;
  }, [
    sortBy,
    filterThermic,
    filterTime,
    searchQuery,
    userProfile.dosha,
    foods,
  ]);

  const handleFoodClick = (food: FoodItem) => {
    onFoodSelected(food);
    onNavigate("report");
  };

  return (
    <div className="browse-container">
      <div className="browse-header">
        <button className="back-button" onClick={() => onNavigate("home")}>
          ← Back
        </button>
        <h1>📚 Food Database</h1>
        <p className="browse-subtitle">
          {loading
            ? "Loading..."
            : `Browse ${filteredAndSortedFoods.length} Indian Dishes`}
        </p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <div className="browse-controls">
        {/* Search */}
        <div className="control-group">
          <input
            type="text"
            placeholder="Search foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-row">
          {/* Sort */}
          <div className="control-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="select-control">
              <option value="name">Name</option>
              <option value="calories">Calories (Low to High)</option>
              <option value="protein">Protein (High to Low)</option>
              {userProfile.dosha && (
                <option value="compatibility">Your Body Type</option>
              )}
            </select>
          </div>

          {/* Thermic Filter */}
          <div className="control-group">
            <label>Thermic:</label>
            <select
              value={filterThermic}
              onChange={(e) =>
                setFilterThermic(
                  e.target.value as "all" | "heating" | "cooling" | "neutral"
                )
              }
              className="select-control">
              <option value="all">All</option>
              <option value="heating">🔥 Heating</option>
              <option value="cooling">❄️ Cooling</option>
              <option value="neutral">⚖️ Neutral</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="control-group">
            <label>Meal Time:</label>
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="select-control">
              <option value="all">All Times</option>
              <option value="breakfast">🌅 Breakfast</option>
              <option value="lunch">☀️ Lunch</option>
              <option value="dinner">🌙 Dinner</option>
              <option value="snack">🥒 Snack</option>
            </select>
          </div>
        </div>
      </div>

      <div className="foods-grid">
        {loading ? (
          <div className="loading-message">
            <p>Loading foods from server...</p>
          </div>
        ) : filteredAndSortedFoods.length > 0 ? (
          filteredAndSortedFoods.map((food) => {
            const compatibility = getFoodCompatibility(
              food as FoodItem,
              userProfile.dosha
            );
            return (
              <div
                key={food.id}
                className={`food-item ${compatibility.compatibility}`}
                onClick={() => handleFoodClick(food as FoodItem)}>
                <div className="food-item-header">
                  <h3>{food.name}</h3>
                  <span className="thermic-badge">{food.thermicQuality}</span>
                </div>

                <p className="food-item-description">{food.description}</p>

                <div className="food-item-stats">
                  <div className="stat">
                    <span className="stat-label">Calories</span>
                    <span className="stat-value">{food.calories}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Protein</span>
                    <span className="stat-value">{food.protein}g</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Time</span>
                    <span className="stat-value">{food.bestTime}</span>
                  </div>
                </div>

                {userProfile.dosha && (
                  <div className="compatibility-badge">
                    <span
                      className={`compat-dot ${compatibility.compatibility}`}></span>
                    <span className="compat-text">
                      {compatibility.compatibility === "good"
                        ? "Good for you"
                        : compatibility.compatibility === "neutral"
                        ? "Neutral"
                        : "Avoid"}
                    </span>
                  </div>
                )}

                <button className="item-button">View Full Details →</button>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>
              {searchQuery || filterThermic !== "all" || filterTime !== "all"
                ? "No foods found matching your filters."
                : "No foods available."}
            </p>
            <button
              className="reset-button"
              onClick={() => {
                setSearchQuery("");
                setFilterThermic("all");
                setFilterTime("all");
              }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
