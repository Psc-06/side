import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { apiClient } from "../utils/apiClient";

import type { FoodItem, UserProfile } from "../types";
import indianFoods from "../data/indianFoods.json";
// Assuming you have this file:
import { barcodeToFoodName } from "../data/barcodeMap";

import "../styles/Scanner.css";

interface ScannerProps {
  userProfile: UserProfile;
  onFoodSelected: (food: FoodItem) => void;
  onNavigate: (
    page: "home" | "scanner" | "report" | "browse" | "recommendations"
  ) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onFoodSelected, onNavigate }) => {
  const allFoods = (indianFoods as { foods: FoodItem[] }).foods;

  // Existing scanner states
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // New barcode scanner states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  // Init / cleanup ZXing reader
  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
      codeReaderRef.current = null;
    };
  }, []);

  // ======== IMAGE UPLOAD (existing feature) ========

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const fileName = file.name.toLowerCase();
      setUploadedFileName(fileName);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Auto-search for matching foods based on file name
      const searchTerm = fileName.split(".")[0]; // remove extension

      if (searchTerm.trim()) {
        const results = allFoods.filter(
          (food) =>
            food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            searchTerm
              .toLowerCase()
              .includes(food.name.toLowerCase().split(" ")[0])
        );

        if (results.length > 0) {
          setFilteredFoods(results);

          const exactMatch = results.find(
            (f) => f.name.toLowerCase() === searchTerm.toLowerCase()
          );
          if (exactMatch) {
            setSelectedFood(exactMatch);
          }
        } else {
          // no match, show all to let user choose
          setFilteredFoods(allFoods);
        }
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim()) {
      const results = allFoods.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFoods(results);
    } else {
      setFilteredFoods([]);
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    setSearchQuery("");
    setFilteredFoods([]);
  };

  /**
   * FIX APPLIED HERE: Converted to async and moved the save history logic inside.
   */
  const handleConfirmFood = async () => {
    if (selectedFood) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Save history for photo scan (or barcode scan if that led to selectedFood)
          await apiClient.saveScanHistory({
            foodId: selectedFood.id,
            method: "photo", // Assuming photo unless barcode was used recently
          });
        } catch (err) {
          console.warn("Failed to save scan history for photo scan", err);
        }
      }

      onFoodSelected(selectedFood);
      onNavigate("report");
    }
  };

  const handleClearImage = () => {
    setPreviewImage(null);
    setUploadedFileName(null);
    setFilteredFoods([]);
    setSearchQuery("");
  };

  // ======== BARCODE SCANNER (NEW FEATURE) ========

  const stopScanner = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  };

  const handleBarcodeDetected = (codeText: string) => {
    stopScanner(); // Stop scanning once a code is found

    setLastScannedCode(codeText);
    setSelectedFood(null); // Clear previously selected food

    // 1. Try mapping barcode → food name (from barcodeMap.ts)
    const mappedName = barcodeToFoodName[codeText];
    let match: FoodItem | undefined;

    if (mappedName) {
      match = allFoods.find(
        (food) => food.name.toLowerCase() === mappedName.toLowerCase()
      );
    }

    // 2. If no direct map match, try fuzzy match on name
    if (!match) {
      match = allFoods.find((food) =>
        food.name.toLowerCase().includes(codeText.toLowerCase())
      );
    }

    if (match) {
      setSelectedFood(match);
      setScanError(null);
    } else {
      // If still nothing, show error but keep code visible
      setScanError(
        "Barcode scanned, but no matching food found. Add mapping in src/data/barcodeMap.ts."
      );
    }
  };

  const startScanner = async () => {
    if (!codeReaderRef.current || !videoRef.current) {
      return;
    }

    setScanError(null);
    setIsScanning(true);
    setLastScannedCode(null);

    try {
      // Passing `null` lets ZXing pick the default camera (usually rear on mobile)
      const controls = await codeReaderRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, error, controls) => {
          if (result) {
            const text = result.getText();
            handleBarcodeDetected(text);
            // controls.stop() is handled inside handleBarcodeDetected or explicitly by stopScanner
          }

          // We ignore "no barcode in frame" errors to avoid spamming UI
          if (error && error.name !== "NotFoundException") {
            console.warn(error);
          }
        }
      );

      controlsRef.current = controls;
    } catch (err) {
      console.error("Error starting barcode scanner", err);
      setScanError("Unable to access camera. Check permissions and HTTPS.");
      setIsScanning(false);
    }
  };

  // ======== RENDER ========

  return (
    <div className="scanner-container">
      <button className="back-button" onClick={() => onNavigate("home")}>
        ← Back
      </button>

      <h1 className="scanner-title">Food Scanner</h1>

      {/* BARCODE SCANNER BLOCK */}
      <section className="barcode-section">
        <h2>📷 Barcode Scanner (Camera)</h2>

        <div className="barcode-controls">
          {!isScanning ? (
            <button className="primary-button" onClick={startScanner}>
              Start Barcode Scanner
            </button>
          ) : (
            <button className="secondary-button" onClick={stopScanner}>
              Stop Scanner
            </button>
          )}
        </div>

        <div className="barcode-video-wrapper">
          <video
            ref={videoRef}
            className="barcode-video"
            autoPlay
            muted
            playsInline
          />
        </div>

        {lastScannedCode && (
          <p className="scan-result">
            Last scanned code: <strong>{lastScannedCode}</strong>
          </p>
        )}

        {scanError && <p className="error-text">{scanError}</p>}
      </section>

      <hr className="scanner-divider" />

      {/* EXISTING IMAGE + SEARCH FLOW */}
      {!selectedFood ? (
        <>
          <section className="image-upload-section">
            {previewImage ? (
              <div className="image-preview-block">
                <img
                  src={previewImage}
                  alt="Uploaded food"
                  className="preview-image"
                />

                {uploadedFileName && (
                  <p className="file-name">
                    File: <strong>{uploadedFileName}</strong>
                  </p>
                )}

                <button className="secondary-button" onClick={handleClearImage}>
                  Clear Image
                </button>
              </div>
            ) : (
              <div className="image-upload-placeholder">
                <p>Take a photo or upload from gallery</p>
                <button
                  className="primary-button"
                  onClick={() => fileInputRef.current?.click()}>
                  Choose Image
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </section>

          <section className="search-section">
            <h2 className="section-title">
              {previewImage ? "Matching Foods" : "Or Search for a Dish"}
            </h2>

            {previewImage && uploadedFileName && (
              <p className="hint-text">
                Found matching foods for "{uploadedFileName.split(".")[0]}".
                Click on a match or search manually.
              </p>
            )}

            <input
              type="text"
              value={searchQuery}
              placeholder="Search by dish name (e.g. Biryani)"
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />

            {filteredFoods.length > 0 && (
              <div className="food-list">
                {filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    className="food-card"
                    onClick={() => handleFoodSelect(food)}>
                    <h4>{food.name}</h4>
                    <p>{food.calories} cal</p>
                    <span className="arrow">→</span>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && filteredFoods.length === 0 && (
              <p className="hint-text">
                No dishes found. Try another search term.
              </p>
            )}
          </section>
        </>
      ) : (
        // SELECTED FOOD SUMMARY
        <section className="selected-food-section">
          <h2>{selectedFood.name}</h2>

          {selectedFood.description && (
            <p className="food-description">{selectedFood.description}</p>
          )}

          <div className="macros-grid">
            <div>
              <strong>Calories</strong>
              <p>{selectedFood.calories}</p>
            </div>
            <div>
              <strong>Protein</strong>
              <p>{selectedFood.protein} g</p>
            </div>
            <div>
              <strong>Carbs</strong>
              <p>{selectedFood.carbs} g</p>
            </div>
            <div>
              <strong>Fats</strong>
              <p>{selectedFood.fats} g</p>
            </div>
          </div>

          <div className="scanner-actions">
            <button
              className="secondary-button"
              onClick={() => {
                setSelectedFood(null);
                setPreviewImage(null);
                setUploadedFileName(null);
                setFilteredFoods([]);
                setSearchQuery("");
                // Ensure scanner is stopped if a selection was made via barcode
                stopScanner();
              }}>
              Change Dish
            </button>

            <button className="primary-button" onClick={handleConfirmFood}>
              View Full Report →
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Scanner;
