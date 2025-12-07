import React, { useState, useEffect } from "react";
import type { Dosha, UserProfile, Page } from "../types";
import "../styles/Home.css";

interface HomeProps {
  onNavigate: (page: Page) => void;
  userProfile: UserProfile;
  onDoshaSelect: (dosha: Dosha) => void;
}

const Home: React.FC<HomeProps> = ({
  onNavigate,
  userProfile,
  onDoshaSelect,
}) => {
  const [selectedDosha, setSelectedDosha] = useState<Dosha | null>(
    userProfile.dosha || null
  );

  useEffect(() => {
    if (userProfile.dosha) {
      setSelectedDosha(userProfile.dosha);
    }
  }, [userProfile.dosha]);

  const doshaInfo: Record<
    Dosha,
    { color: string; icon: string; traits: string; description: string }
  > = {
    Vata: {
      color: "#8B4513",
      icon: "🌬️",
      traits: "Dry, Light, Cold, Mobile",
      description: "Movement & Creativity",
    },
    Pitta: {
      color: "#DC143C",
      icon: "🔥",
      traits: "Hot, Sharp, Oily, Intense",
      description: "Metabolism & Transformation",
    },
    Kapha: {
      color: "#4169E1",
      icon: "💧",
      traits: "Heavy, Moist, Cold, Stable",
      description: "Structure & Stability",
    },
  };

  return (
    <div className="home-container">
      <h1>Ayurveda Food Scanner</h1>
      <p className="subtitle">Discover Your Perfect Diet Based on Your Dosha</p>
      <p>Eat according to your body type and balance your energy naturally.</p>

      <section className="dosha-section">
        <h2>What's Your Body Type?</h2>
        <p>
          {selectedDosha
            ? `You've selected: ${selectedDosha}`
            : "Select your Dosha to get started"}
        </p>

        <div className="dosha-cards">
          {(["Vata", "Pitta", "Kapha"] as Dosha[]).map((dosha) => (
            <button
              key={dosha}
              className={`dosha-card ${
                selectedDosha === dosha ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedDosha(dosha);
                localStorage.setItem("selectedDosha", dosha);
                onDoshaSelect(dosha);
              }}>
              <span className="dosha-icon">{doshaInfo[dosha].icon}</span>
              <h3>{dosha}</h3>
              <p>{doshaInfo[dosha].description}</p>
              <small>{doshaInfo[dosha].traits}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="actions-section">
        <h2>What You Can Do</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => onNavigate("scanner")}>
            <h3>📷 Scan Food (Photo)</h3>
            <p>
              Take a photo or select from gallery to identify Indian dishes.
            </p>
            <span className="action-link">Start Scanning</span>
          </button>

          <button
            className="action-card"
            onClick={() => onNavigate("barcode-scanner")}>
            <h3>🏷️ Scan via Barcode</h3>
            <p>Use your camera to scan barcodes on packaged foods.</p>
            <span className="action-link">Open Barcode Scanner</span>
          </button>

          <button className="action-card" onClick={() => onNavigate("browse")}>
            <h3>🍛 Browse Foods</h3>
            <p>Explore our database of Indian dishes and nutrition.</p>
            <span className="action-link">Browse Database</span>
          </button>

          <button
            className="action-card"
            onClick={() => onNavigate("recommendations")}>
            <h3>✨ Get Recommendations</h3>
            <p>Receive personalized food suggestions for your body type.</p>
            <span className="action-link">View Recommendations</span>
          </button>

          <button className="action-card" onClick={() => onNavigate("history")}>
            <h3>🕒 View Scan History</h3>
            <p>See all your recently scanned foods (login required).</p>
            <span className="action-link">View History</span>
          </button>
        </div>
      </section>

      <section className="dosha-info-section">
        <h2>Understanding Your Dosha</h2>

        <h3>🌬️ Vata (Air)</h3>
        <p>
          Governs movement, creativity, and nervous system. Naturally prone to
          dryness and cold. Needs warm, grounding foods.
        </p>

        <h3>🔥 Pitta (Fire)</h3>
        <p>
          Governs metabolism and transformation. Naturally warm and intense.
          Needs cooling and soothing foods.
        </p>

        <h3>💧 Kapha (Water)</h3>
        <p>
          Governs structure and stability. Naturally heavy and moist. Needs
          stimulating and light foods.
        </p>
      </section>
    </div>
  );
};

export default Home;
