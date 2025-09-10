import React, { useEffect } from 'react';
import { Button } from './ui/button';
import type { RequestItem } from './GameScreen';

interface RedactionPreviewProps {
  request: RequestItem;
  onConfirm: (allowOriginal: boolean) => void;
  onClose: () => void;
}

export function RedactionPreview({ request, onConfirm, onClose }: RedactionPreviewProps) {
  // Focus trap and keyboard handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'Enter':
          // Confirm the focused action
          const activeElement = document.activeElement as HTMLButtonElement;
          if (activeElement && activeElement.click) {
            activeElement.click();
          }
          break;
      }
    };

    // Focus first button
    const firstButton = document.querySelector('.redaction-confirm') as HTMLButtonElement;
    if (firstButton) {
      firstButton.focus();
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  const generateRedactedContent = (content: string, threats: any[]): string => {
    let redacted = content;
    
    threats.forEach(threat => {
      switch (threat.tag) {
        case 'EMAIL':
          redacted = redacted.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]');
          break;
        case 'PHONE':
          redacted = redacted.replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE]');
          break;
        case 'API_KEY':
          redacted = redacted.replace(/\bsk_test_\w+/g, '[API_KEY]');
          break;
        case 'TOKEN':
          redacted = redacted.replace(/\b[A-Za-z0-9]{20,}\b/g, '[TOKEN]');
          break;
      }
    });
    
    return redacted;
  };

  const getConfidenceLevel = (): 'LOW' | 'MEDIUM' | 'HIGH' => {
    const threatCount = request.detected.length;
    if (threatCount >= 3) return 'HIGH';
    if (threatCount >= 2) return 'MEDIUM';
    return threatCount > 0 ? 'MEDIUM' : 'LOW';
  };

  const redactedContent = generateRedactedContent(request.content, request.detected);
  const confidence = getConfidenceLevel();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-slate-800 border-2 border-pink-400 max-w-4xl w-full max-h-[90vh] overflow-auto space-y-6 p-6"
        role="dialog"
        aria-labelledby="redaction-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h2 id="redaction-title" className="text-pink-400 text-xl tracking-wider">
              REDACTION PREVIEW
            </h2>
            <button
              onClick={onClose}
              className="text-green-400 hover:text-green-300 text-xl"
              aria-label="Close redaction preview"
            >
              ×
            </button>
          </div>
          
          {/* Threat chips and confidence */}
          <div className="flex flex-wrap items-center gap-2">
            {request.detected.map((threat, index) => (
              <span
                key={index}
                className="bg-red-600 text-red-100 px-2 py-1 text-xs border border-red-400"
              >
                {threat.tag} {threat.count && threat.count > 1 ? `×${threat.count}` : ''}
              </span>
            ))}
            <span className={`px-2 py-1 text-xs border ${
              confidence === 'HIGH' ? 'bg-red-600 border-red-400 text-red-100' :
              confidence === 'MEDIUM' ? 'bg-amber-600 border-amber-400 text-amber-100' :
              'bg-green-600 border-green-400 text-green-100'
            }`}>
              Confidence: {confidence}
            </span>
          </div>
        </div>

        {/* Content panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original content */}
          <div className="space-y-2">
            <h3 className="text-green-400 tracking-wider">ORIGINAL</h3>
            <div className="bg-black border border-green-600 p-4 font-mono text-green-300 text-sm leading-relaxed h-32 overflow-auto">
              {request.content}
            </div>
          </div>

          {/* Redacted content */}
          <div className="space-y-2">
            <h3 className="text-pink-400 tracking-wider">AFTER REDACTION</h3>
            <div className="bg-black border border-pink-600 p-4 font-mono text-pink-300 text-sm leading-relaxed h-32 overflow-auto">
              {redactedContent}
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="bg-pink-900/30 border border-pink-600 p-3 text-pink-300 text-sm">
          <strong>Sensitive information has been automatically redacted</strong> to protect privacy and security. 
          Review the changes and decide whether to allow the original content or proceed with redaction.
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => onConfirm(true)}
            className="h-12 bg-slate-600 hover:bg-slate-500 text-green-400 border-2 border-green-600 hover:border-green-500"
            title={!request.assessment.redactionRequired ? "Recommended" : "Not recommended"}
          >
            ALLOW ORIGINAL
            {request.assessment.redactionRequired && (
              <div className="text-xs mt-1 text-amber-400">Not recommended</div>
            )}
          </Button>
          
          <Button
            onClick={() => onConfirm(false)}
            className="redaction-confirm h-12 bg-pink-600 hover:bg-pink-500 text-black border-2 border-pink-400"
          >
            CONFIRM REDACTION
            <div className="text-xs mt-1">Proceed with redacted content</div>
          </Button>
        </div>

        {/* Help text */}
        <div className="text-center text-xs text-green-500">
          Press Enter to confirm selection · ESC to close
        </div>
      </div>
    </div>
  );
}