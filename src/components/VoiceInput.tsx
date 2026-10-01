import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Square, AlertCircle, Volume2, Sparkles } from 'lucide-react';
import { TranslationDictionary } from '../data/translations';
import { AccessibilitySettings } from '../types';
import {
  isSpeechRecognitionSupported,
  startListening,
  stopListening,
} from '../services/speech';

interface VoiceInputProps {
  speechCode: string;
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
  onTranscriptSubmitted: (transcript: string) => void;
  onSwitchToType: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  speechCode,
  translations,
  accessibility,
  onTranscriptSubmitted,
  onSwitchToType,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      if (currentText.trim()) {
        onTranscriptSubmitted(currentText.trim());
        setCurrentText('');
      }
      return;
    }

    setErrorMessage(null);
    setCurrentText('');

    if (!isSupported) {
      setErrorMessage(translations.micDeniedNote);
      onSwitchToType();
      return;
    }

    const stop = startListening(speechCode, {
      onStart: () => {
        setIsListening(true);
      },
      onResult: (text: string) => {
        setCurrentText(text);
      },
      onError: (err: string) => {
        setIsListening(false);
        setErrorMessage(translations.micDeniedNote);
      },
      onEnd: () => {
        setIsListening(false);
        // If we captured speech, submit it
        setCurrentText((prev) => {
          if (prev.trim()) {
            onTranscriptSubmitted(prev.trim());
          }
          return '';
        });
      },
    });

    if (!stop) {
      setIsListening(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-b from-amber-100/50 to-emerald-50/40 dark:from-stone-800/60 dark:to-stone-900/60 rounded-3xl border border-amber-200 dark:border-stone-700 shadow-sm relative overflow-hidden">
      {/* Decorative calm background rings */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-200/20 dark:bg-amber-800/10 rounded-full blur-2xl pointer-events-none" />

      {/* Primary Voice Action Prompt */}
      <div className="text-center mb-5 max-w-sm">
        <h3 className={`font-extrabold text-stone-900 dark:text-stone-100 ${accessibility.largeText ? 'text-2xl' : 'text-xl'}`}>
          {isListening ? translations.listening : translations.mainQuestion}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
          {isListening ? translations.listeningDesc : translations.appSubtitle}
        </p>
      </div>

      {/* Big Microphone Button */}
      <div className="relative my-2 flex items-center justify-center">
        {/* Pulsing visual rings during speech */}
        {isListening && (
          <>
            <span className="absolute w-36 h-36 rounded-full bg-emerald-500/20 animate-ping" />
            <span className="absolute w-28 h-28 rounded-full bg-emerald-500/30 animate-pulse" />
          </>
        )}

        <button
          onClick={handleToggleListening}
          className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center gap-1 font-bold text-white shadow-xl transition-all transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400 ${
            isListening
              ? 'bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 ring-4 ring-rose-300 dark:ring-rose-900 scale-105'
              : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-700/30'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start speaking'}
        >
          {isListening ? (
            <>
              <Square className="w-8 h-8 fill-current" />
              <span className="text-[11px] font-extrabold tracking-wider uppercase">
                {translations.stopAudio}
              </span>
            </>
          ) : (
            <>
              <Mic className="w-9 h-9" />
              <span className="text-xs font-black tracking-wide">
                {translations.voiceButton}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Real-time transcribed text display */}
      {isListening && (
        <div className="mt-4 px-4 py-2.5 bg-white/90 dark:bg-stone-800/90 rounded-2xl border border-emerald-300 dark:border-emerald-700 shadow-sm max-w-md w-full text-center">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">
            {translations.processingVoice}
          </p>
          <p className="text-base font-bold text-stone-800 dark:text-stone-100 min-h-[1.5rem]">
            {currentText || '...'}
          </p>
        </div>
      )}

      {/* Error or Fallback Notice */}
      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 max-w-sm text-center">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Type fallback switch button */}
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={onSwitchToType}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-600 hover:border-emerald-500 text-xs font-bold shadow-sm transition"
        >
          <span>{translations.typeButton}</span>
        </button>
      </div>
    </div>
  );
};
