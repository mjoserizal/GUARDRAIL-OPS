import React, { useState, useEffect } from "react";
import { PixelDemon } from "./PixelDemon";
import { FloatingActionButton } from "./FloatingActionButton";
import type { Screen, Difficulty } from "../App";

interface HomepageProps {
  difficulty: Difficulty;
  onNavigate: (screen: Screen, difficulty?: Difficulty) => void;
}

export function Homepage({
  difficulty,
  onNavigate,
}: HomepageProps) {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>(difficulty);
  const [hoveredCard, setHoveredCard] =
    useState<Difficulty | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "enter":
          handleStartMission();
          break;
        case "?":
          setShowHelpModal(true);
          break;
        case "escape":
          setShowHelpModal(false);
          break;
        case "1":
          setSelectedDifficulty("casual");
          break;
        case "2":
          setSelectedDifficulty("pro");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () =>
      window.removeEventListener("keydown", handleKeyPress);
  }, [selectedDifficulty]);

  const handleStartMission = () => {
    onNavigate("game", selectedDifficulty);
  };

  const handleDifficultySelect = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    // Small animation effect
    const card = document.querySelector(
      `[data-difficulty="${diff}"]`,
    );
    if (card) {
      card.classList.add("animate-pulse");
      setTimeout(
        () => card.classList.remove("animate-pulse"),
        200,
      );
    }
  };

  const getThreatLevel = () => {
    return selectedDifficulty === "pro" ? "PRO" : "CASUAL";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-pixel">

      {/* Main content container */}
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-4xl md:text-6xl tracking-wider text-retro-green glitch-text">
              GUARDRAIL OPS
            </h1>
            <PixelDemon
              state={hoveredCard ? "alert" : "idle"}
              size="medium"
              className={hoveredCard === "pro" ? "scale-x-[-1]" : ""}
            />
          </div>

          <div className="text-sm md:text-base text-retro-green tracking-widest">
            DIGITAL SECURITY OPERATIVE
          </div>
          <p className="text-xs md:text-sm text-retro-gray max-w-lg mx-auto leading-relaxed">
            Mission Briefing: Incoming data requests require immediate security assessment
          </p>
        </div>


        {/* Main game panel */}
        <div className="pixel-box text-retro-green p-6 md:p-8 space-y-6">
          {/* Difficulty selection */}
          <div className="space-y-4">
            <h2 className="text-retro-pink text-center tracking-wider text-lg md:text-xl">
              SELECT DIFFICULTY
            </h2>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              role="radiogroup"
              aria-label="Select difficulty level"
            >
              {/* Casual Mode */}
              <button
                data-difficulty="casual"
                className={`
                  retro-button text-left p-4 h-auto
                  ${selectedDifficulty === "casual"
                    ? "border-retro-green text-retro-green bg-retro-navy"
                    : "border-retro-green text-retro-green hover:bg-retro-navy/50"
                  }
                  focus:ring-retro
                `}
                onClick={() => handleDifficultySelect("casual")}
                onMouseEnter={() => setHoveredCard("casual")}
                onMouseLeave={() => setHoveredCard(null)}
                role="radio"
                aria-checked={selectedDifficulty === "casual"}
                aria-describedby="casual-description"
              >
                <div className="text-xl tracking-wider mb-2">
                  CASUAL
                </div>
                <div
                  id="casual-description"
                  className="text-sm opacity-80"
                >
                  Standard timer, good for learning
                </div>
              </button>

              {/* Pro Mode */}
              <button
                data-difficulty="pro"
                className={`
                  retro-button text-left p-4 h-auto
                  ${selectedDifficulty === "pro"
                    ? "border-retro-pink text-retro-pink bg-retro-navy"
                    : "border-retro-pink text-retro-pink hover:bg-retro-navy/50"
                  }
                  focus:ring-retro
                `}
                onClick={() => handleDifficultySelect("pro")}
                onMouseEnter={() => setHoveredCard("pro")}
                onMouseLeave={() => setHoveredCard(null)}
                role="radio"
                aria-checked={selectedDifficulty === "pro"}
                aria-describedby="pro-description"
              >
                <div className="text-xl tracking-wider mb-2">
                  PRO
                </div>
                <div
                  id="pro-description"
                  className="text-sm opacity-80"
                >
                  25% faster timer, for experts
                </div>
              </button>
            </div>
          </div>

          {/* Start Mission Button */}
          {/* Start Mission Button */}
          <button
            className="retro-button w-full"
            onClick={handleStartMission}
          >
            START MISSION ▶
          </button>

          {/* Status strip */}
          <div className="flex justify-between items-center text-xs tracking-wider pt-4 border-t-2 border-retro-green">
            <div className="text-retro-green">
              SECURITY CLEARANCE: <span>ACTIVE</span>
            </div>
            <div
              className={
                selectedDifficulty === "pro"
                  ? "text-retro-amber"
                  : "text-retro-green"
              }
            >
              THREAT LEVEL: <span>{getThreatLevel()}</span>
            </div>
          </div>
        </div>

        {/* Footer hints */}
        <div className="text-center space-y-2 text-xs text-retro-gray">
          <p>
            Use keyboard shortcuts for faster navigation. Press
            (?) anytime for help.
          </p>
          <p>
            V1.0.0{" "}
            <span className="tracking-wider">
              CLASSIFIED SYSTEM
            </span>
          </p>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onNavigate={onNavigate} />

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="pixel-box text-retro-green p-6 max-w-md w-full space-y-4">
            <h3 className="text-retro-green text-lg tracking-wider text-center">
              KEYBOARD SHORTCUTS
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Start Mission:</span>
                <span className="text-retro-amber">Enter</span>
              </div>
              <div className="flex justify-between">
                <span>Select Casual:</span>
                <span className="text-retro-amber">1</span>
              </div>
              <div className="flex justify-between">
                <span>Select Pro:</span>
                <span className="text-retro-amber">2</span>
              </div>
              <div className="flex justify-between">
                <span>Help:</span>
                <span className="text-retro-amber">?</span>
              </div>
              <div className="flex justify-between">
                <span>Close/Back:</span>
                <span className="text-retro-amber">Esc</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full retro-button bg-retro-green text-black border-retro-green"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}