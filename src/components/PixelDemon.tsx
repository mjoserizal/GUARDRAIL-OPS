import React, { useState, useEffect } from 'react';

export type DemonState = 'idle' | 'alert' | 'rage' | 'cheer' | 'glitch';

interface PixelDemonProps {
  state?: DemonState;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showConfetti?: boolean;
}

export function PixelDemon({ 
  state = 'idle', 
  size = 'medium', 
  className = '',
  showConfetti = false 
}: PixelDemonProps) {
  const [frame, setFrame] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  // Animation frame cycling
  useEffect(() => {
    let frameCount = 8;
    let fps = 10;
    
    switch (state) {
      case 'idle':
        frameCount = 8;
        fps = 10;
        break;
      case 'alert':
        frameCount = 8;
        fps = 10;
        break;
      case 'rage':
        frameCount = 12;
        fps = 12;
        break;
      case 'cheer':
        frameCount = 12;
        fps = 12;
        break;
      case 'glitch':
        frameCount = 8;
        fps = 8;
        break;
    }

    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % frameCount);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [state]);

  // Glitch effect for certain states
  useEffect(() => {
    if (state === 'glitch') {
      const glitchInterval = setInterval(() => {
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 100);
      }, 1400);

      return () => clearInterval(glitchInterval);
    }
  }, [state]);

  // Confetti effect
  useEffect(() => {
    if (showConfetti && state === 'cheer') {
      // Simple confetti animation
      const confettiCount = 12;
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'absolute w-1 h-1 bg-pink-400 rounded pointer-events-none';
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
        confetti.style.animation = `confetti-fall 600ms ease-out forwards`;
        
        const parent = document.querySelector('.demon-container');
        if (parent) {
          parent.appendChild(confetti);
          setTimeout(() => confetti.remove(), 600);
        }
      }
    }
  }, [showConfetti, state]);

  const getDemonSprite = () => {
    // Retro pixel demon with solid colors
    const baseClasses = `${sizeClasses[size]} relative border-2 pixelated`;
    
    switch (state) {
      case 'idle':
        return `${baseClasses} border-retro-green bg-retro-green ${showGlitch ? 'opacity-90' : ''}`;
      case 'alert':
        return `${baseClasses} border-retro-amber bg-retro-amber`;
      case 'rage':
        return `${baseClasses} border-retro-red bg-retro-red animate-pulse`;
      case 'cheer':
        return `${baseClasses} border-retro-pink bg-retro-pink`;
      case 'glitch':
        return `${baseClasses} border-retro-green bg-retro-green ${showGlitch ? 'opacity-75' : ''}`;
      default:
        return `${baseClasses} border-retro-green bg-retro-green`;
    }
  };

  return (
    <div className={`demon-container relative ${className}`}>
      <div
        className={`${getDemonSprite()} transition-all duration-150 pixelated`}
        style={{
          imageRendering: 'pixelated',
          imageRendering: '-moz-crisp-edges',
          imageRendering: 'crisp-edges'
        }}
        aria-hidden="true"
      >
        {/* Pixel eyes */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-black pixelated"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-black pixelated"></div>
        
        {/* Mouth/expression based on state */}
        {state === 'cheer' && (
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-black pixelated"></div>
        )}
        {state === 'rage' && (
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-black pixelated"></div>
        )}
        {(state === 'alert' || state === 'idle') && (
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-black pixelated"></div>
        )}
      </div>
      
      {/* Status label for larger sizes */}
      {size === 'large' && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
          Status: {state.charAt(0).toUpperCase() + state.slice(1)}
        </div>
      )}
    </div>
  );
}

// CSS animation for confetti
const style = document.createElement('style');
style.textContent = `
  @keyframes confetti-fall {
    0% {
      transform: translate(-50%, -50%) rotate(0deg) translateY(0px);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg) translateY(40px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);