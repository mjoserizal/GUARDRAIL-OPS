import React, { useState } from 'react';
import { Button } from './ui/button';
import { PixelDemon } from './PixelDemon';
import type { Screen } from '../App';

interface FloatingActionButtonProps {
  onNavigate: (screen: Screen) => void;
}

export function FloatingActionButton({ onNavigate }: FloatingActionButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMenu = () => {
    setIsAnimating(true);
    setIsMenuOpen(!isMenuOpen);
    setTimeout(() => setIsAnimating(false), 250);
  };

  const handleMenuItemClick = (screen: Screen) => {
    if (screen === 'training') {
      onNavigate(screen);
    }
    setIsMenuOpen(false);
  };

  const handleUpgradesClick = () => {
    // Shake animation for disabled item
    const button = document.querySelector('.upgrades-button');
    if (button) {
      button.classList.add('animate-bounce');
      setTimeout(() => button.classList.remove('animate-bounce'), 300);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action Menu */}
      {isMenuOpen && (
        <div 
          className="absolute bottom-16 right-0 pixel-box text-retro-green min-w-48 animate-in slide-in-from-bottom-2 fade-in duration-200"
          role="menu"
          aria-label="Quick actions menu"
        >
          <div className="p-2 space-y-1">
            <button
              onClick={() => handleMenuItemClick('training')}
              className="w-full text-left px-3 py-2 text-retro-green hover:bg-retro-navy/50 transition-colors duration-150 text-sm tracking-wide"
              role="menuitem"
            >
              Training Module
            </button>
            
            <button
              onClick={handleUpgradesClick}
              className="upgrades-button w-full text-left px-3 py-2 text-retro-gray cursor-not-allowed text-sm tracking-wide relative"
              disabled
              role="menuitem"
              aria-disabled="true"
            >
              System Upgrades
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-retro-amber text-black px-1">
                Coming Soon
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleMenu}
        className="w-14 h-14 retro-button bg-retro-pink border-retro-pink text-black p-0 relative overflow-hidden"
        aria-expanded={isMenuOpen}
        aria-label="Open quick actions menu"
        aria-haspopup="menu"
      >
        {/* Rabbit Demon FAB */}
        <div className="relative">
          <PixelDemon 
            state={isAnimating ? 'alert' : 'idle'} 
            size="small"
            className={`transition-transform duration-200 ${isMenuOpen ? 'scale-110' : 'hover:scale-105'}`}
          />
          
          {/* Wink/ear wiggle effect */}
          {isAnimating && (
            <div className="absolute inset-0 bg-pink-300/20 rounded-full animate-pulse"></div>
          )}
        </div>
      </button>

      {/* Click outside to close */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}