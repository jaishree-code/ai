import React from 'react';
import { AccessibilitySettings } from '../types';
import { TranslationDictionary } from '../data/translations';
import { Type, Moon, Sun, Volume2, Turtle, Rabbit, X, Check } from 'lucide-react';

interface AccessibilityControlsProps {
  settings: AccessibilitySettings;
  translations: TranslationDictionary;
  onChange: (updated: Partial<AccessibilitySettings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  settings,
  translations,
  onChange,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700 mb-4">
          <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>{translations.accessibilityTitle}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
            aria-label="Close accessibility options"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* 🔠 Larger text toggle */}
          <button
            onClick={() => onChange({ largeText: !settings.largeText })}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition ${
              settings.largeText
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-extrabold'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium'
            }`}
          >
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-bold">{translations.largerText}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Increase size of words and buttons for easy viewing
                </p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${settings.largeText ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400'}`}>
              {settings.largeText && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* 🌙 High Contrast Mode toggle */}
          <button
            onClick={() => onChange({ highContrast: !settings.highContrast })}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition ${
              settings.highContrast
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-extrabold'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium'
            }`}
          >
            <div className="flex items-center gap-3">
              {settings.highContrast ? (
                <Moon className="w-5 h-5 text-amber-500" />
              ) : (
                <Sun className="w-5 h-5 text-stone-500" />
              )}
              <div className="text-left">
                <p className="text-sm font-bold">{translations.highContrast}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  High contrast dark theme with sharp borders
                </p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${settings.highContrast ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400'}`}>
              {settings.highContrast && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* 🔊 Read Everything Aloud toggle */}
          <button
            onClick={() => onChange({ autoReadAloud: !settings.autoReadAloud })}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition ${
              settings.autoReadAloud
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-extrabold'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium'
            }`}
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-bold">{translations.autoReadAloud}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Automatically narrate each step when it opens
                </p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${settings.autoReadAloud ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400'}`}>
              {settings.autoReadAloud && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* 🐢 Slow explanation toggle */}
          <button
            onClick={() => onChange({ slowSpeech: !settings.slowSpeech })}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition ${
              settings.slowSpeech
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-extrabold'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium'
            }`}
          >
            <div className="flex items-center gap-3">
              {settings.slowSpeech ? (
                <Turtle className="w-5 h-5 text-emerald-600" />
              ) : (
                <Rabbit className="w-5 h-5 text-stone-500" />
              )}
              <div className="text-left">
                <p className="text-sm font-bold">{translations.slowSpeech}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Speak very slowly and clearly so words are easy to absorb
                </p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${settings.slowSpeech ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400'}`}>
              {settings.slowSpeech && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition shadow-md"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};
