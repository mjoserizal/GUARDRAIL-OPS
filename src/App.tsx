import React, { useState, useEffect } from "react";
import { Homepage } from "./components/Homepage";
import { GameScreen } from "./components/GameScreen";
import { MissionComplete } from "./components/MissionComplete";
import { TrainingModule } from "./components/TrainingModule";
import bg from "./assets/images/bg-guardrail.png"; // 👉 import background image

export type Screen = "home" | "game" | "complete" | "training";
export type Difficulty = "casual" | "pro";

export interface GameState {
  score: number;
  lives: number;
  wave: number;
  totalWaves: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  falsePositives: number;
  falseNegatives: number;
  bestCombo: number;
  currentCombo: number;
  startTime: number;
}

export interface AppState {
  currentScreen: Screen;
  difficulty: Difficulty;
  gameState: GameState;
}

const initialGameState: GameState = {
  score: 0,
  lives: 3,
  wave: 1,
  totalWaves: 5,
  accuracy: 0,
  correct: 0,
  incorrect: 0,
  falsePositives: 0,
  falseNegatives: 0,
  bestCombo: 0,
  currentCombo: 0,
  startTime: Date.now(),
};

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: "home",
    difficulty: "casual",
    gameState: initialGameState,
  });

  // Load saved difficulty preference
  useEffect(() => {
    const savedDifficulty = localStorage.getItem(
      "guardrailops_difficulty"
    ) as Difficulty;
    if (savedDifficulty) {
      setAppState((prev) => ({ ...prev, difficulty: savedDifficulty }));
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "escape":
          if (appState.currentScreen !== "home") {
            navigateTo("home");
          }
          break;
        case "?":
          // Show help (future feature)
          break;
        case "u":
          if (appState.currentScreen === "home") {
            // Toggle upgrades menu
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [appState.currentScreen]);

  const navigateTo = (screen: Screen, difficulty?: Difficulty) => {
    if (difficulty) {
      localStorage.setItem("guardrailops_difficulty", difficulty);
      setAppState((prev) => ({
        ...prev,
        currentScreen: screen,
        difficulty,
        gameState:
          screen === "game"
            ? { ...initialGameState, startTime: Date.now() }
            : prev.gameState,
      }));
    } else {
      setAppState((prev) => ({
        ...prev,
        currentScreen: screen,
        gameState:
          screen === "game"
            ? { ...initialGameState, startTime: Date.now() }
            : prev.gameState,
      }));
    }
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setAppState((prev) => ({
      ...prev,
      gameState: { ...prev.gameState, ...updates },
    }));
  };

  const resetGame = () => {
    setAppState((prev) => ({
      ...prev,
      gameState: { ...initialGameState, startTime: Date.now() },
    }));
    navigateTo("game");
  };

  return (
    <div
      className="min-h-screen text-retro-green font-pixel relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`, // 👉 pakai background image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay efek scanline supaya tetap retro */}
      <div className="fixed inset-0 opacity-30 pointer-events-none pixel-grid"></div>
      <div className="fixed inset-0 pointer-events-none opacity-10 scanlines"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {appState.currentScreen === "home" && (
          <Homepage
            difficulty={appState.difficulty}
            onNavigate={navigateTo}
          />
        )}

        {appState.currentScreen === "game" && (
          <GameScreen
            difficulty={appState.difficulty}
            gameState={appState.gameState}
            onUpdateGameState={updateGameState}
            onNavigate={navigateTo}
          />
        )}

        {appState.currentScreen === "complete" && (
          <MissionComplete
            difficulty={appState.difficulty}
            gameState={appState.gameState}
            onNavigate={navigateTo}
            onResetGame={resetGame}
          />
        )}

        {appState.currentScreen === "training" && (
          <TrainingModule onNavigate={navigateTo} />
        )}
      </div>
    </div>
  );
}
