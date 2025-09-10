import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { PixelDemon } from './PixelDemon';
import { RedactionPreview } from './RedactionPreview';
import type { Screen, Difficulty, GameState } from '../App';

export type ThreatTag = "TOXICITY"|"EMAIL"|"PHONE"|"API_KEY"|"TOKEN"|"XSS"|"SQLI"|"CMDI";
export type Risk = "LOW"|"MEDIUM"|"HIGH";

export interface RequestItem {
  id: string;
  source: string;
  user?: string;
  content: string;
  detected: {tag: ThreatTag; count?: number}[];
  assessment: { malicious: boolean; risk: Risk; redactionRequired: boolean };
}

interface GameScreenProps {
  difficulty: Difficulty;
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
  onNavigate: (screen: Screen) => void;
}

// Mock security requests data
const mockRequests: RequestItem[] = [
  {
    id: '1',
    source: 'WikiSearch',
    user: 'Fireb',
    content: 'What are the system requirements?',
    detected: [],
    assessment: { malicious: false, risk: 'LOW', redactionRequired: false }
  },
  {
    id: '2',
    source: 'DataShare',
    user: 'DevUser',
    content: 'Here is my contact: john.doe@company.com and my API key: sk_test_4eC39HqLyjWDarjtT1zdp7dc',
    detected: [{tag: 'EMAIL', count: 1}, {tag: 'API_KEY', count: 1}],
    assessment: { malicious: false, risk: 'MEDIUM', redactionRequired: true }
  },
  {
    id: '3',
    source: 'UserInput',
    user: 'TestUser',
    content: 'Please help me with my account setup. My phone is 555-123-4567',
    detected: [{tag: 'PHONE', count: 1}],
    assessment: { malicious: false, risk: 'LOW', redactionRequired: true }
  },
  {
    id: '4',
    source: 'APIRequest',
    user: 'ScriptKid',
    content: 'SELECT * FROM users WHERE admin=1; DROP TABLE users;',
    detected: [{tag: 'SQLI'}],
    assessment: { malicious: true, risk: 'HIGH', redactionRequired: false }
  },
  {
    id: '5',
    source: 'FormSubmit',
    user: 'RegularUser',
    content: 'Thank you for the great service! Everything works perfectly.',
    detected: [],
    assessment: { malicious: false, risk: 'LOW', redactionRequired: false }
  }
];

export function GameScreen({ difficulty, gameState, onUpdateGameState, onNavigate }: GameScreenProps) {
  const [currentRequest, setCurrentRequest] = useState<RequestItem>(mockRequests[0]);
  const [timeRemaining, setTimeRemaining] = useState(8);
  const [isInputLocked, setIsInputLocked] = useState(false);
  const [showRedactionModal, setShowRedactionModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const maxTime = difficulty === 'pro' ? 6 : 8; // Shorter timer for retro feel

  // Timer countdown
  useEffect(() => {
    if (isInputLocked) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInputLocked, currentRequest.id]);

  // Reset timer when new request loads
  useEffect(() => {
    setTimeRemaining(maxTime);
  }, [currentRequest.id, maxTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isInputLocked || showRedactionModal) return;

      switch (e.key.toLowerCase()) {
        case 'a':
          handleAction('allow');
          break;
        case 'r':
          handleAction('redact');
          break;
        case 'b':
          handleAction('block');
          break;
        case 'escape':
          onNavigate('home');
          break;
        case '?':
          // Show help
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isInputLocked, showRedactionModal]);

  const handleTimeUp = () => {
    handleIncorrectAction('Time expired');
    nextRequest();
  };

  const handleAction = (action: 'allow' | 'redact' | 'block') => {
    if (isInputLocked) return;

    if (action === 'redact') {
      setShowRedactionModal(true);
      return;
    }

    setIsInputLocked(true);
    
    const isCorrect = evaluateAction(action);
    
    if (isCorrect) {
      handleCorrectAction();
    } else {
      handleIncorrectAction(getIncorrectReason(action));
    }

    setTimeout(() => {
      nextRequest();
    }, 1500);
  };

  const evaluateAction = (action: 'allow' | 'block'): boolean => {
    const { malicious, redactionRequired } = currentRequest.assessment;
    
    if (action === 'allow') {
      return !malicious && !redactionRequired;
    } else if (action === 'block') {
      return malicious;
    }
    
    return false;
  };

  const getIncorrectReason = (action: 'allow' | 'block'): string => {
    const { malicious, redactionRequired } = currentRequest.assessment;
    
    if (action === 'allow' && malicious) {
      return 'Allowed malicious content';
    } else if (action === 'allow' && redactionRequired) {
      return 'Sensitive data not redacted';
    } else if (action === 'block' && !malicious) {
      return 'Blocked safe content';
    }
    
    return 'Incorrect decision';
  };

  const handleCorrectAction = () => {
    const newScore = gameState.score + 100;
    const newCorrect = gameState.correct + 1;
    const newCombo = gameState.currentCombo + 1;
    const newBestCombo = Math.max(gameState.bestCombo, newCombo);
    const newAccuracy = Math.round((newCorrect / (newCorrect + gameState.incorrect)) * 100);

    onUpdateGameState({
      score: newScore,
      correct: newCorrect,
      currentCombo: newCombo,
      bestCombo: newBestCombo,
      accuracy: newAccuracy
    });

    setFeedbackMessage('+100');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);
  };

  const handleIncorrectAction = (reason: string) => {
    const newIncorrect = gameState.incorrect + 1;
    const newLives = Math.max(0, gameState.lives - 1);
    const newAccuracy = gameState.correct > 0 ? Math.round((gameState.correct / (gameState.correct + newIncorrect)) * 100) : 0;

    let updates: Partial<GameState> = {
      incorrect: newIncorrect,
      lives: newLives,
      currentCombo: 0,
      accuracy: newAccuracy
    };

    if (reason === 'Blocked safe content') {
      updates.falsePositives = gameState.falsePositives + 1;
    } else if (reason === 'Allowed malicious content') {
      updates.falseNegatives = gameState.falseNegatives + 1;
    }

    onUpdateGameState(updates);

    setFeedbackMessage(`-200`);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);

    if (newLives === 0) {
      setTimeout(() => onNavigate('complete'), 2000);
    }
  };

  const nextRequest = () => {
    setIsInputLocked(false);
    setTimeRemaining(maxTime);
    
    if (gameState.wave >= gameState.totalWaves) {
      onNavigate('complete');
      return;
    }

    const nextIndex = (gameState.wave) % mockRequests.length;
    setCurrentRequest(mockRequests[nextIndex]);
    
    onUpdateGameState({
      wave: gameState.wave + 1
    });
  };

  const handleRedactionConfirm = (allowOriginal: boolean) => {
    setShowRedactionModal(false);
    setIsInputLocked(true);

    const { redactionRequired } = currentRequest.assessment;
    const isCorrect = allowOriginal ? !redactionRequired : redactionRequired;

    if (isCorrect) {
      handleCorrectAction();
    } else {
      handleIncorrectAction(allowOriginal ? 'Should have redacted' : 'Unnecessary redaction');
    }

    setTimeout(() => {
      nextRequest();
    }, 1500);
  };

  const getTimerProgress = (): number => {
    return (timeRemaining / maxTime) * 100;
  };

  const getDemonState = () => {
    const { risk, malicious } = currentRequest.assessment;
    if (malicious || risk === 'HIGH') return 'rage';
    if (risk === 'MEDIUM') return 'alert';
    return 'idle';
  };

  return (
    <div className="min-h-screen p-4 space-y-4 font-pixel">
      {/* Top HUD - 4 stat boxes */}
      <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
        {/* Score */}
        <div className="pixel-box text-retro-green p-3 text-center relative">
          <div className="text-xs mb-1">SCORE</div>
          <div className="text-lg">{gameState.score}</div>
          {showFeedback && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-retro-green text-sm animate-bounce">
              {feedbackMessage}
            </div>
          )}
        </div>
        
        {/* Wave */}
        <div className="pixel-box text-retro-pink p-3 text-center">
          <div className="text-xs mb-1">WAVE</div>
          <div className="text-lg">{gameState.wave}/{gameState.totalWaves}</div>
        </div>
        
        {/* Lives */}
        <div className="pixel-box text-retro-green p-3 text-center">
          <div className="text-xs mb-1">LIVES</div>
          <div className="text-lg flex justify-center gap-1">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className={i < gameState.lives ? 'text-retro-pink' : 'text-retro-gray'}>
                ♥
              </span>
            ))}
          </div>
        </div>
        
        {/* Accuracy */}
        <div className="pixel-box text-retro-pink p-3 text-center">
          <div className="text-xs mb-1">ACCURACY</div>
          <div className="text-lg">{gameState.accuracy}.0%</div>
        </div>
      </div>

      {/* Main Request Panel */}
      <div className="max-w-6xl mx-auto">
        <div className="pixel-box text-retro-green p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-sm">Incoming Request</div>
              <div className="text-retro-green">{currentRequest.source}</div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm">User</div>
              <div className="text-retro-green">{currentRequest.user}</div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <div className="text-sm">Message Content</div>
            <div className="bg-black border-2 border-retro-green p-4 min-h-16">
              <div className="text-retro-green">{currentRequest.content}</div>
            </div>
          </div>

          {/* Detected Threats */}
          <div className="space-y-2">
            <div className="text-sm">Detected Threats</div>
            <div className="min-h-8 flex flex-wrap gap-2">
              {currentRequest.detected.length === 0 ? (
                <div className="text-retro-gray text-sm">None detected</div>
              ) : (
                currentRequest.detected.map((threat, index) => (
                  <span
                    key={index}
                    className="bg-retro-red text-black px-2 py-1 text-xs border-2 border-retro-red"
                  >
                    {threat.tag} {threat.count && threat.count > 1 ? `×${threat.count}` : ''}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Security Assessment */}
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="text-sm">Security Assessment</div>
              <div className="space-y-1 text-sm">
                <div>
                  Malicious: <span className={currentRequest.assessment.malicious ? 'text-retro-red' : 'text-retro-green'}>
                    {currentRequest.assessment.malicious ? 'YES' : 'NO'}
                  </span>
                </div>
                <div>
                  Risk: <span className={
                    currentRequest.assessment.risk === 'HIGH' ? 'text-retro-red' :
                    currentRequest.assessment.risk === 'MEDIUM' ? 'text-retro-amber' : 'text-retro-green'
                  }>
                    {currentRequest.assessment.risk}
                  </span>
                </div>
                <div>
                  Redaction Required: <span className={currentRequest.assessment.redactionRequired ? 'text-retro-amber' : 'text-retro-green'}>
                    {currentRequest.assessment.redactionRequired ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Demon Status */}
            <div className="text-center">
              <PixelDemon 
                state={getDemonState()}
                size="medium"
              />
              <div className="text-xs mt-1">Status: {getDemonState()}</div>
            </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-retro-green">
            <span>Time Remaining</span>
            <span>{timeRemaining}s</span>
          </div>
          <div className="w-full h-4 bg-retro-navy border-2 border-retro-green">
            <div 
              className="h-full bg-retro-amber transition-all duration-1000 ease-linear"
              style={{ width: `${getTimerProgress()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
        <button
          onClick={() => handleAction('allow')}
          disabled={isInputLocked}
          className="retro-button bg-retro-green text-retro-green border-retro-green h-16 text-center disabled:opacity-50"
        >
          <div className="text-lg">ALLOW ○</div>
          <div className="text-xs mt-1">Allow Request to Proceed</div>
        </button>
        
        <button
          onClick={() => handleAction('redact')}
          disabled={isInputLocked}
          className="retro-button bg-retro-pink text-retro-pink border-retro-pink h-16 text-center disabled:opacity-50"
        >
          <div className="text-lg">REDACT ◊</div>
          <div className="text-xs mt-1">Remove Sensitive Data</div>
        </button>
        
        <button
          onClick={() => handleAction('block')}
          disabled={isInputLocked}
          className="retro-button bg-retro-red text-retro-red border-retro-red h-16 text-center disabled:opacity-50"
        >
          <div className="text-lg">BLOCK ⊗</div>
          <div className="text-xs mt-1">Block Malicious Request</div>
        </button>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center text-xs text-retro-gray">
          <div>
            Use keyboard shortcuts or click buttons<br />
            A - Allow · R - Redact · B - Block · ? - Help
          </div>
          <div className="text-right">
            Wave: {gameState.wave}<br />
            Difficulty: {difficulty}
          </div>
        </div>
      </div>

      {/* Redaction Preview Modal */}
      {showRedactionModal && (
        <RedactionPreview
          request={currentRequest}
          onConfirm={handleRedactionConfirm}
          onClose={() => setShowRedactionModal(false)}
        />
      )}
    </div>
  );
}