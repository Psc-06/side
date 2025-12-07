const API_BASE_URL = "/api";

export const apiClient = {
  async getFoods() {
    const response = await fetch(`${API_BASE_URL}/foods`);
    if (!response.ok) throw new Error("Failed to fetch foods");
    return response.json();
  },

  async getFood(id: number) {
    const response = await fetch(`${API_BASE_URL}/foods/${id}`);
    if (!response.ok) throw new Error("Failed to fetch food");
    return response.json();
  },

  async searchFoods(query: string) {
    const response = await fetch(
      `${API_BASE_URL}/foods/search/${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Failed to search foods");
    return response.json();
  },

  async getFoodsByDosha(dosha: string) {
    const response = await fetch(`${API_BASE_URL}/foods/dosha/${dosha}`);
    if (!response.ok) throw new Error("Failed to fetch foods by dosha");
    return response.json();
  },

  async analyzeFoodCompatibility(foodId: number, dosha: string) {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodId, dosha }),
    });
    if (!response.ok) throw new Error("Failed to analyze food");
    return response.json();
  },

  async getRecommendations(dosha: string) {
    const response = await fetch(`${API_BASE_URL}/recommendations/${dosha}`);
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    return response.json();
  },

  async getUserProfile(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    } catch (err) {
      console.warn("Profile fetch failed, using localStorage fallback");
      return null;
    }
  },

  async saveUserProfile(userId: string, dosha: string | null) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, dosha }),
    });
    if (!response.ok) throw new Error("Failed to save profile");
    return response.json();
  },

  // ===============================
  // NEW: Scan history helpers
  // ===============================

  async saveScanHistory(params: {
    foodId: number;
    method: string;
    barcode?: string | null;
  }) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No auth token – scan history will not be saved.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/scan-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to save scan history");
    }

    return response.json();
  },

  async getScanHistory(token: string) {
    const response = await fetch(`${API_BASE_URL}/scan-history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("Not authenticated");
    }
    if (!response.ok) {
      throw new Error("Failed to load scan history");
    }

    return response.json();
  },
};
