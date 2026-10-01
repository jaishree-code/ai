import React, { useEffect } from 'react';
import { TranslationDictionary } from '../data/translations';
import { AccessibilitySettings } from '../types';
import {
  Sparkles,
  RotateCcw,
  Home,
  ExternalLink,
  Award,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { speakText } from '../services/speech';

interface CompletionScreenProps {
  speechCode: string;
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
  onStartAgain: () => void;
  onGoHome: () => void;
  onOpenPractice: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  speechCode,
  translations,
  accessibility,
  onStartAgain,
  onGoHome,
  onOpenPractice,
}) => {
  const { completion } = translations;

  useEffect(() => {
    // If autoReadAloud is enabled, celebrate with voice narration
    if (accessibility.autoReadAloud) {
      const celebration = `${completion.title}. ${completion.subtitle}. ${completion.description}`;
      speakText(celebration, speechCode, accessibility.slowSpeech);
    }
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-emerald-50 via-white to-amber-50 dark:from-stone-800 dark:via-stone-850 dark:to-stone-900 rounded-3xl p-6 sm:p-10 border-2 border-emerald-400 dark:border-emerald-600 shadow-xl text-center animate-fade-in my-4">
      {/* Celebration Icon */}
      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-5 animate-bounce">
        <Award className="w-10 h-10" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        Digital Independence Milestone
      </span>

      <h2 className={`font-black text-stone-900 dark:text-stone-100 tracking-tight mb-2 ${accessibility.largeText ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
        {completion.title}
      </h2>

      <p className={`font-bold text-emerald-800 dark:text-emerald-300 mb-3 ${accessibility.largeText ? 'text-xl' : 'text-base sm:text-lg'}`}>
        {completion.subtitle}
      </p>

      <p className={`text-stone-600 dark:text-stone-300 max-w-lg mx-auto mb-6 leading-relaxed ${accessibility.largeText ? 'text-lg' : 'text-sm sm:text-base'}`}>
        {completion.description}
      </p>

      {/* Empowerment Affirmation Card */}
      <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-100/70 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 shadow-xs mb-8 flex items-center gap-3 text-left">
        <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
        <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
          {completion.empowermentNote}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <a
          href="https://www.digilocker.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-lg shadow-emerald-700/25 transition"
        >
          <span>{completion.openDigiLocker}</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <button
          onClick={onOpenPractice}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-amber-950 dark:text-stone-100 font-extrabold text-sm border border-amber-300 dark:border-stone-600 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{completion.tryPractice}</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-stone-200 dark:border-stone-700">
        <button
          onClick={onStartAgain}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{completion.startAgain}</span>
        </button>

        <span className="text-stone-300">|</span>

        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{completion.home}</span>
        </button>
      </div>
    </div>
  );
};
