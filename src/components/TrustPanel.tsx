import React from 'react';
import { TranslationDictionary } from '../data/translations';
import { AccessibilitySettings } from '../types';
import { ShieldCheck, ShieldAlert, CheckCircle2, Building, HeartHandshake } from 'lucide-react';

interface TrustPanelProps {
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
}

export const TrustPanel: React.FC<TrustPanelProps> = ({
  translations,
  accessibility,
}) => {
  return (
    <section className="w-full bg-amber-50/70 dark:bg-stone-900/80 rounded-3xl p-5 sm:p-7 border border-amber-300 dark:border-stone-700 shadow-xs my-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`font-black text-stone-900 dark:text-stone-100 ${accessibility.largeText ? 'text-2xl' : 'text-xl'}`}>
            {translations.trustTitle}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            {translations.trustSubtitle}
          </p>
        </div>
      </div>

      {/* 5 Golden Safety Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
        {translations.trustRules.map((rule, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              ✓
            </span>
            <span className={`font-bold text-stone-800 dark:text-stone-200 ${accessibility.largeText ? 'text-base' : 'text-xs sm:text-sm'}`}>
              {rule}
            </span>
          </div>
        ))}
      </div>

      {/* Distinction Guide: Sahaayi vs Official DigiLocker */}
      <div className="mt-5 pt-4 border-t border-amber-200 dark:border-stone-700">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 text-center sm:text-left">
          Understanding the Distinction
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Sahaayi Guide Role */}
          <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <HeartHandshake className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <h5 className="font-extrabold text-emerald-950 dark:text-emerald-200 text-sm">
                {translations.distinctionGuide.sahaayiRole}
              </h5>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
              {translations.distinctionGuide.sahaayiFeatures.map((feat, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official DigiLocker Role */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h5 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                {translations.distinctionGuide.officialRole}
              </h5>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
              {translations.distinctionGuide.officialFeatures.map((feat, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
