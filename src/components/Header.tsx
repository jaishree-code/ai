import React from 'react';
import { LanguageInfo, AccessibilitySettings } from '../types';
import { TranslationDictionary } from '../data/translations';
import { Globe, Settings, ShieldCheck, Sparkles, Volume2 } from 'lucide-react';

interface HeaderProps {
  currentLang: LanguageInfo;
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
  onOpenLanguageModal: () => void;
  onToggleAccessibility: () => void;
  onOpenPractice: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  translations,
  accessibility,
  onOpenLanguageModal,
  onToggleAccessibility,
  onOpenPractice,
  onGoHome,
}) => {
  return (
    <header className="w-full bg-amber-50/90 dark:bg-stone-900 border-b border-amber-200 dark:border-stone-700 sticky top-0 z-40 backdrop-blur-md transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-lg p-1 transition"
          aria-label={`${translations.appName} Home`}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/20">
            स
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-extrabold tracking-tight text-emerald-900 dark:text-emerald-300 ${accessibility.largeText ? 'text-2xl' : 'text-xl'}`}>
                {translations.appName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                Guide
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-1 font-medium">
              {translations.appTagline}
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Practice Mode trigger for Judges / Users */}
          <button
            onClick={onOpenPractice}
            className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold border border-emerald-300 dark:border-emerald-700 transition"
            title={translations.practiceTitle}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Practice</span>
          </button>

          {/* Active Language Selector Pill */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-amber-300 dark:border-stone-600 shadow-sm hover:border-emerald-500 font-semibold text-sm transition"
            aria-label="Change Language"
          >
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">
              {currentLang.nativeName}
            </span>
          </button>

          {/* Accessibility Settings Toggle */}
          <button
            onClick={onToggleAccessibility}
            className="p-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-amber-300 dark:border-stone-600 shadow-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition"
            aria-label="Accessibility Options"
            title="Accessibility Options"
          >
            <Settings className="w-4 h-4 text-stone-700 dark:text-stone-200" />
          </button>
        </div>
      </div>
    </header>
  );
};
