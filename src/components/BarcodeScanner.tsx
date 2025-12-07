import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import type { FoodItem, UserProfile } from "../types";
import indianFoods from "../data/indianFoods.json";
import "../styles/Scanner.css";

interface BarcodeScannerProps {
  userProfile: UserProfile;
  onFoodSelected: (food: FoodItem) => void;
  onNavigate: (page: string) => void; // <— simpler
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  userProfile,
  onFoodSelected,
  onNavigate,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [matchedFood, setMatchedFood] = useState<FoodItem | null>(null);

  const allFoods = (indianFoods as { foods: FoodItem[] }).foods;

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
      codeReaderRef.current = null;
    };
  }, []);

  const stopScanner = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  };

  const handleBarcodeDetected = (codeText: string) => {
    setLastScannedCode(codeText);

    let food: FoodItem | null = null;

    const asNumber = Number(codeText);
    if (!Number.isNaN(asNumber)) {
      food = allFoods.find((f) => f.id === asNumber) || null;
    }

    if (!food && allFoods.length > 0) {
      food = allFoods[0];
    }

    if (food) {
      setMatchedFood(food);
      setScanError(null);
    } else {
      setMatchedFood(null);
      setScanError("Barcode scanned, but no matching food found.");
    }

    stopScanner();
  };

  const startScanner = async () => {
    if (!codeReaderRef.current || !videoRef.current) return;

    setScanError(null);
    setMatchedFood(null);
    setLastScannedCode(null);
    setIsScanning(true);

    try {
      const controls = await codeReaderRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, error, controlsInstance) => {
          if (result) {
            const text = result.getText();
            handleBarcodeDetected(text);
            controlsInstance.stop();
            controlsRef.current = null;
            setIsScanning(false);
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

  const handleConfirm = () => {
    if (!matchedFood) return;
    onFoodSelected(matchedFood);
    onNavigate("report");
  };

  return (
    <div className="scanner-container">
      <button className="back-button" onClick={() => onNavigate("home")}>
        ← Back
      </button>

      <h1 className="scanner-title">Barcode Scanner</h1>
      <p className="hint-text">
        Point your camera at the barcode on a packaged food item.
      </p>

      <div className="barcode-controls">
        {!isScanning ? (
          <button className="primary-button" onClick={startScanner}>
            Start Scanner
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
          Last scanned: <strong>{lastScannedCode}</strong>
        </p>
      )}

      {scanError && <p className="error-text">{scanError}</p>}

      {matchedFood && (
        <div className="selected-food-section">
          <h2>{matchedFood.name}</h2>
          <p className="food-description">{matchedFood.description}</p>

          <div className="macros-grid">
            <div>
              <strong>Calories</strong>
              <p>{matchedFood.calories}</p>
            </div>
            <div>
              <strong>Protein</strong>
              <p>{matchedFood.protein} g</p>
            </div>
            <div>
              <strong>Carbs</strong>
              <p>{matchedFood.carbs} g</p>
            </div>
            <div>
              <strong>Fats</strong>
              <p>{matchedFood.fats} g</p>
            </div>
          </div>

          <button className="primary-button" onClick={handleConfirm}>
            View Full Report →
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
