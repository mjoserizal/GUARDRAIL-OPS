import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { PixelDemon } from './PixelDemon';
import type { Screen, Difficulty, GameState } from '../App';

export type Tier = "EXCELLENT" | "GOOD" | "NEED_IMPROVEMENT";

interface MissionCompleteProps {
  difficulty: Difficulty;
  gameState: GameState;
  onNavigate: (screen: Screen) => void;
  onResetGame: () => void;
}

export function MissionComplete({ difficulty, gameState, onNavigate, onResetGame }: MissionCompleteProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [tier, setTier] = useState<Tier>('NEED_IMPROVEMENT');

  // Calculate performance tier
  useEffect(() => {
    const calculateTier = (): Tier => {
      if (gameState.accuracy >= 90 || gameState.score >= 2000) {
        return 'EXCELLENT';
      } else if (gameState.accuracy >= 70) {
        return 'GOOD';
      } else {
        return 'NEED_IMPROVEMENT';
      }
    };

    setTier(calculateTier());
  }, [gameState.accuracy, gameState.score]);

  // Animated number counting
  useEffect(() => {
    const scoreTimer = setInterval(() => {
      setDisplayScore(prev => {
        if (prev >= gameState.score) {
          clearInterval(scoreTimer);
          return gameState.score;
        }
        return Math.min(prev + Math.ceil(gameState.score / 30), gameState.score);
      });
    }, 50);

    const accuracyTimer = setInterval(() => {
      setDisplayAccuracy(prev => {
        if (prev >= gameState.accuracy) {
          clearInterval(accuracyTimer);
          return gameState.accuracy;
        }
        return Math.min(prev + 1, gameState.accuracy);
      });
    }, 40);

    // Show stats after a delay
    setTimeout(() => setShowStats(true), 500);

    return () => {
      clearInterval(scoreTimer);
      clearInterval(accuracyTimer);
    };
  }, [gameState.score, gameState.accuracy]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'enter':
          onResetGame();
          break;
        case 'f':
          handleAIFeedback();
          break;
        case 's':
          handleDownload();
          break;
        case 'escape':
          onNavigate('home');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onResetGame, onNavigate]);

  const handleAIFeedback = () => {
    // Placeholder for AI feedback modal
    alert('AI Feedback feature coming soon!');
  };

  const handleDownload = () => {
    // Generate canvas snapshot of results
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#22c55e';
    ctx.font = '32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GUARDRAIL OPS - MISSION COMPLETE', canvas.width / 2, 50);

    // Performance rating
    ctx.fillStyle = tier === 'EXCELLENT' ? '#22c55e' : tier === 'GOOD' ? '#f59e0b' : '#ef4444';
    ctx.font = '24px monospace';
    ctx.fillText(tier.replace('_', ' '), canvas.width / 2, 100);

    // Stats
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px monospace';
    ctx.textAlign = 'left';

    const stats = [
      `Final Score: ${gameState.score}`,
      `Accuracy: ${gameState.accuracy}%`,
      `Waves: ${gameState.wave - 1}/${gameState.totalWaves}`,
      `Time: ${Math.floor((Date.now() - gameState.startTime) / 60000)}:${Math.floor(((Date.now() - gameState.startTime) % 60000) / 1000).toString().padStart(2, '0')}`,
      ``,
      `Decisions:`,
      `✓ Correct: ${gameState.correct}`,
      `✗ Incorrect: ${gameState.incorrect}`,
      `Total: ${gameState.correct + gameState.incorrect}`,
      ``,
      `Error Analysis:`,
      `⚠ False Positives: ${gameState.falsePositives}`,
      `⚠ False Negatives: ${gameState.falseNegatives}`,
      `🔥 Best Combo: ${gameState.bestCombo}`
    ];

    stats.forEach((stat, index) => {
      ctx.fillText(stat, 50, 150 + (index * 25));
    });

    // Download
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
    link.download = `GuardrailOps_Result_${gameState.score}_${timestamp}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const getDurationString = (): string => {
    const duration = Date.now() - gameState.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDemonState = () => {
    switch (tier) {
      case 'EXCELLENT':
      case 'GOOD':
        return 'cheer';
      default:
        return 'glitch';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      {/* Title with demon */}
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl md:text-6xl tracking-wider text-green-400">
          MISSION COMPLETE
        </h1>

        <div className="flex justify-center w-full">
          <PixelDemon
            state={getDemonState()}
            size="large"
            showConfetti={tier === 'EXCELLENT'}
          />
        </div>
      </div>

      {/* Main results panel */}
      <div className="w-full max-w-4xl border-2 border-green-400 bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 space-y-6">
        {/* Performance rating */}
        <div className="text-center space-y-2">
          <div className="text-sm text-green-400 tracking-wider">Performance Rating</div>
          <div className={`text-2xl md:text-3xl tracking-wider ${tier === 'EXCELLENT' ? 'text-green-400' :
              tier === 'GOOD' ? 'text-amber-400' :
                'text-red-400'
            }`}>
            {tier.replace('_', ' ')}
          </div>
        </div>

        {/* Metrics strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-1">
            <div className="text-2xl text-green-400">{displayScore}</div>
            <div className="text-sm text-green-300">Final Score</div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-2xl text-green-400">{displayAccuracy}%</div>
            <div className="text-sm text-green-300">Accuracy</div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-2xl text-green-400">{gameState.wave - 1}/{gameState.totalWaves}</div>
            <div className="text-sm text-green-300">Waves</div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-2xl text-green-400">{getDurationString()}</div>
            <div className="text-sm text-green-300">Time</div>
          </div>
        </div>

        {/* Detailed breakdown */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-green-600">
            {/* Decisions */}
            <div className="space-y-3">
              <h3 className="text-green-400 tracking-wider">DECISIONS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Correct
                  </span>
                  <span className="text-green-300">{gameState.correct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-red-400">✗</span> Incorrect
                  </span>
                  <span className="text-red-300">{gameState.incorrect}</span>
                </div>
                <div className="flex justify-between border-t border-green-600 pt-2">
                  <span className="flex items-center gap-2">
                    <span className="text-green-400">Σ</span> Total
                  </span>
                  <span className="text-green-300">{gameState.correct + gameState.incorrect}</span>
                </div>
              </div>
            </div>

            {/* Error analysis */}
            <div className="space-y-3">
              <h3 className="text-green-400 tracking-wider">ERROR ANALYSIS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-red-400">⚠</span> False Positives
                  </span>
                  <span className="text-red-300">{gameState.falsePositives}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-amber-400">⚠</span> False Negatives
                  </span>
                  <span className="text-amber-300">{gameState.falseNegatives}</span>
                </div>
                <div className="flex justify-between border-t border-green-600 pt-2">
                  <span className="flex items-center gap-2">
                    <span className="text-pink-400">🔥</span> Best Combo
                  </span>
                  <span className="text-pink-300">{gameState.bestCombo}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        <Button
          onClick={onResetGame}
          className="flex-1 h-12 bg-green-600 hover:bg-green-500 text-black border-2 border-green-400 text-lg tracking-wider"
          autoFocus
        >
          PLAY AGAIN ▶
        </Button>

        <Button
          onClick={handleAIFeedback}
          className="flex-1 h-12 bg-pink-600 hover:bg-pink-500 text-black border-2 border-pink-400 text-lg tracking-wider"
        >
          GET AI FEEDBACK 🧠
        </Button>

        <Button
          onClick={handleDownload}
          className="w-full md:w-16 h-12 bg-slate-600 hover:bg-slate-500 text-green-400 border-2 border-green-600"
          title="Download result (S)"
        >
          ⬇
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2 text-xs text-green-500">
        <p>Thank you for protecting the digital realm, Guardian. 👾</p>
        <p>Press <strong>ESC</strong> to close or back home.</p>
      </div>
    </div>
  );
}