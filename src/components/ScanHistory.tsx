import React, { useEffect, useState } from "react";
import type { Page, ScanHistoryItem } from "../types";
import { apiClient } from "../utils/apiClient";
import "../styles/Browse.css"; // reuse styles

interface ScanHistoryProps {
  onNavigate: (page: Page) => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const loadHistory = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiClient.getScanHistory(token);
        setItems(data);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load scan history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [token]);

  if (!token) {
    return (
      <div className="page-container">
        <button className="back-button" onClick={() => onNavigate("home")}>
          ← Back
        </button>

        <h1>Scan History</h1>
        <p>You need to log in to view your scan history.</p>

        <button className="primary-button" onClick={() => onNavigate("login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => onNavigate("home")}>
        ← Back
      </button>

      <h1>Scan History</h1>

      {loading && <p>Loading your scans...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <p>You have not scanned any foods yet.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="food-list">
          {items
            .slice()
            .reverse()
            .map((item) => (
              <div key={item._id} className="food-card">
                <h3>{item.foodName || `Food #${item.foodId}`}</h3>
                <p>
                  Method: <strong>{item.method}</strong>
                </p>
                {item.barcode && (
                  <p>
                    Barcode: <code>{item.barcode}</code>
                  </p>
                )}
                {item.calories != null && <p>Calories: {item.calories} kcal</p>}
                {item.thermicQuality && <p>Thermic: {item.thermicQuality}</p>}
                {item.createdAt && (
                  <p className="hint-text">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ScanHistory;
