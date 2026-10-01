import React from 'react';
import { TranslationDictionary } from '../data/translations';
import { AccessibilitySettings } from '../types';
import { Heart, Sparkles, Shield, Users, Mic, BookOpen } from 'lucide-react';

interface AboutSectionProps {
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  translations,
  accessibility,
}) => {
  return (
    <footer className="w-full mt-12 pt-8 pb-12 border-t border-amber-200 dark:border-stone-800 bg-amber-50/40 dark:bg-stone-900/50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hackathon Challenge Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider mb-2 border border-amber-300 dark:border-amber-700">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-600" />
            <span>College Hackathon Challenge: "The Invisible Woman"</span>
          </div>

          <h3 className={`font-extrabold text-stone-900 dark:text-stone-100 mt-2 ${accessibility.largeText ? 'text-2xl' : 'text-xl'}`}>
            {translations.manifesto}
          </h3>

          <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400 mt-2 tracking-wide">
            {translations.pillars}
          </p>
        </div>

        {/* Core Mission Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs text-center">
            <div className="w-9 h-9 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2">
              <Mic className="w-4 h-4" />
            </div>
            <h5 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm mb-1">
              Voice-First
            </h5>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Speak naturally in any of 12 Indian languages without typing worries.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs text-center">
            <div className="w-9 h-9 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <h5 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm mb-1">
              One Step at a Time
            </h5>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Zero clutter or technical jargon. Calm, clear guidance at your own pace.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs text-center">
            <div className="w-9 h-9 mx-auto rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-2">
              <Shield className="w-4 h-4" />
            </div>
            <h5 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm mb-1">
              Complete Privacy
            </h5>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Sahaayi never asks for OTP, password, or Aadhaar credentials.
            </p>
          </div>
        </div>

        {/* Clear Official Disclaimer */}
        <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 text-center text-xs text-stone-600 dark:text-stone-400 max-w-2xl mx-auto space-y-1">
          <p className="font-bold text-stone-800 dark:text-stone-200">
            Sahaayi is an independent guidance tool.
          </p>
          <p>
            Sahaayi is not an official Government of India application. For actual government services, always use the official government website (
            <a
              href="https://www.digilocker.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 dark:text-emerald-400 underline font-semibold hover:text-emerald-800"
            >
              digilocker.gov.in
            </a>
            ).
          </p>
        </div>
      </div>
    </footer>
  );
};
