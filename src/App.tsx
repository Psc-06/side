import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import type { FoodItem, UserProfile, Page } from "./types";
import type { User } from "./types/auth";

import Home from "./components/Home";
import Scanner from "./components/Scanner";
import Report from "./components/Report";
import Browse from "./components/Browse";
import Recommendations from "./components/Recommendations";
import Login from "./components/Login";
import Signup from "./components/Signup";
import BarcodeScanner from "./components/BarcodeScanner";
import ScanHistory from "./components/ScanHistory";

import "./App.css";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({ dosha: null });
  const [user, setUser] = useState<User | null>(null);

  const getCurrentPage = (): Page => {
    const path = location.pathname.replace("/", "");
    if (path === "" || path === "/") return "home";
    const allowed: Page[] = [
      "home",
      "scanner",
      "barcode-scanner",
      "report",
      "browse",
      "recommendations",
      "history",
      "login",
      "signup",
    ];
    if (allowed.includes(path as Page)) {
      return path as Page;
    }
    return "home";
  };

  const currentPage = getCurrentPage();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedDosha = localStorage.getItem("selectedDosha");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse saved user");
      }
    }

    if (savedDosha) {
      setUserProfile({ dosha: savedDosha as any });
    }
  }, []);

  useEffect(() => {
    if (userProfile.dosha) {
      localStorage.setItem("selectedDosha", userProfile.dosha);
    }
  }, [userProfile.dosha]);

  const handleNavigate = (page: Page) => {
    if (page === "home") {
      navigate("/");
    } else {
      navigate(`/${page}`);
    }
  };

  const handleLoginSuccess = (userData: User, authToken: string) => {
    setUser(userData);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.dosha) {
      setUserProfile({ dosha: userData.dosha });
    }
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleFoodSelected = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleDoshaSelect = (dosha: any) => {
    setUserProfile({ dosha });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div
          className="app-logo"
          onClick={() => handleNavigate("home")}
          role="button">
          Ayurveda Scanner
        </div>

        <nav className="app-nav">
          <button
            className={currentPage === "home" ? "nav-link active" : "nav-link"}
            onClick={() => handleNavigate("home")}>
            Home
          </button>
          <button
            className={
              currentPage === "scanner" ? "nav-link active" : "nav-link"
            }
            onClick={() => handleNavigate("scanner")}>
            Scanner
          </button>
          <button
            className={
              currentPage === "barcode-scanner" ? "nav-link active" : "nav-link"
            }
            onClick={() => handleNavigate("barcode-scanner")}>
            Barcode
          </button>
          <button
            className={
              currentPage === "browse" ? "nav-link active" : "nav-link"
            }
            onClick={() => handleNavigate("browse")}>
            Browse
          </button>
          <button
            className={
              currentPage === "recommendations" ? "nav-link active" : "nav-link"
            }
            onClick={() => handleNavigate("recommendations")}>
            Tips
          </button>
          <button
            className={
              currentPage === "history" ? "nav-link active" : "nav-link"
            }
            onClick={() => handleNavigate("history")}>
            History
          </button>
        </nav>

        <div className="app-header-right">
          {userProfile.dosha && (
            <span className="dosha-pill">{userProfile.dosha}</span>
          )}

          {user ? (
            <>
              <span className="user-name">Welcome, {user.name}</span>
              <button className="secondary-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="secondary-button"
                onClick={() => handleNavigate("login")}>
                Login
              </button>
              <button
                className="primary-button"
                onClick={() => handleNavigate("signup")}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onNavigate={handleNavigate}
                userProfile={userProfile}
                onDoshaSelect={handleDoshaSelect}
              />
            }
          />
          <Route
            path="/scanner"
            element={
              <Scanner
                userProfile={userProfile}
                onFoodSelected={handleFoodSelected}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/barcode-scanner"
            element={
              <BarcodeScanner
                userProfile={userProfile}
                onFoodSelected={handleFoodSelected}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/report"
            element={
              <Report
                food={selectedFood}
                userProfile={userProfile}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/browse"
            element={
              <Browse
                userProfile={userProfile}
                onFoodSelected={handleFoodSelected}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/recommendations"
            element={
              <Recommendations
                userProfile={userProfile}
                onFoodSelected={handleFoodSelected}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/history"
            element={<ScanHistory onNavigate={handleNavigate} />}
          />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/signup"
            element={<Signup onSignupSuccess={handleLoginSuccess} />}
          />
        </Routes>
      </main>

      <footer className="app-footer">
        © 2024 Ayurveda Food Scanner | Eat According to Your Body Type | Made
        with ❤️
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
