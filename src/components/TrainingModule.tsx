import React, { useEffect } from 'react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface TrainingModuleProps {
  onNavigate: (screen: Screen) => void;
}

export function TrainingModule({ onNavigate }: TrainingModuleProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onNavigate('home');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNavigate]);

  const trainingTopics = [
    {
      title: 'Threat Detection Basics',
      description: 'Learn to identify common security threats in data requests',
      status: 'Available',
      difficulty: 'Beginner'
    },
    {
      title: 'Advanced Redaction Techniques',
      description: 'Master the art of sensitive data redaction',
      status: 'Available',
      difficulty: 'Intermediate'
    },
    {
      title: 'Malicious Content Analysis',
      description: 'Deep dive into identifying malicious intent',
      status: 'Coming Soon',
      difficulty: 'Advanced'
    },
    {
      title: 'Real-time Decision Making',
      description: 'Build speed and accuracy under pressure',
      status: 'Coming Soon',
      difficulty: 'Expert'
    }
  ];

  return (
    <div className="min-h-screen p-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl tracking-wider text-green-400">
          TRAINING MODULE
        </h1>
        <p className="text-green-300 max-w-2xl mx-auto">
          Enhance your security assessment skills through structured training programs
        </p>
      </div>

      {/* Training content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Overview */}
        <div className="border-2 border-green-400 bg-slate-800/50 p-6 space-y-4">
          <h2 className="text-green-400 text-xl tracking-wider">GUARDIAN CERTIFICATION PROGRAM</h2>
          <p className="text-green-300 leading-relaxed">
            Welcome to the comprehensive training system designed to transform you into an elite digital security operative. 
            Master the skills needed to protect sensitive data and identify threats in real-time scenarios.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-green-600">
            <div className="text-center">
              <div className="text-2xl text-green-400 mb-1">4</div>
              <div className="text-sm text-green-300">Training Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-green-400 mb-1">∞</div>
              <div className="text-sm text-green-300">Practice Scenarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-green-400 mb-1">24/7</div>
              <div className="text-sm text-green-300">Access Available</div>
            </div>
          </div>
        </div>

        {/* Training modules */}
        <div className="space-y-4">
          <h3 className="text-pink-400 text-xl tracking-wider">AVAILABLE TRAINING MODULES</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingTopics.map((topic, index) => (
              <div 
                key={index}
                className={`
                  border-2 p-4 space-y-3 transition-all duration-200
                  ${topic.status === 'Available' 
                    ? 'border-green-400 bg-slate-800/50 hover:bg-green-900/20' 
                    : 'border-gray-600 bg-slate-700/30 opacity-60'
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-green-400 tracking-wide">{topic.title}</h4>
                  <span className={`
                    text-xs px-2 py-1 border
                    ${topic.difficulty === 'Beginner' ? 'border-green-400 text-green-400' :
                      topic.difficulty === 'Intermediate' ? 'border-amber-400 text-amber-400' :
                      topic.difficulty === 'Advanced' ? 'border-red-400 text-red-400' :
                      'border-purple-400 text-purple-400'
                    }
                  `}>
                    {topic.difficulty}
                  </span>
                </div>
                
                <p className="text-green-300 text-sm leading-relaxed">
                  {topic.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className={`
                    text-xs tracking-wider
                    ${topic.status === 'Available' ? 'text-green-400' : 'text-gray-400'}
                  `}>
                    {topic.status}
                  </span>
                  
                  {topic.status === 'Available' ? (
                    <Button
                      className="bg-green-600 hover:bg-green-500 text-black px-4 py-1 h-8 text-sm"
                      onClick={() => {
                        // Placeholder for training module
                        alert(`${topic.title} module will be available in future updates!`);
                      }}
                    >
                      START
                    </Button>
                  ) : (
                    <div className="text-gray-500 text-sm">Coming Soon</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick practice */}
        <div className="border-2 border-pink-400 bg-slate-800/50 p-6 space-y-4">
          <h3 className="text-pink-400 text-xl tracking-wider">QUICK PRACTICE</h3>
          <p className="text-pink-300">
            Jump into a practice scenario to test your current skills without affecting your main progress.
          </p>
          <Button
            onClick={() => {
              // Could implement a practice mode
              alert('Practice mode coming soon! For now, try the main game.');
              onNavigate('home');
            }}
            className="bg-pink-600 hover:bg-pink-500 text-black border-2 border-pink-400"
          >
            START PRACTICE SESSION
          </Button>
        </div>

        {/* Back button */}
        <div className="text-center pt-8">
          <Button
            onClick={() => onNavigate('home')}
            className="bg-slate-600 hover:bg-slate-500 text-green-400 border-2 border-green-600 px-8"
          >
            ← BACK TO MAIN MENU
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-green-500">
        Press <strong>ESC</strong> to return to main menu
      </div>
    </div>
  );
}