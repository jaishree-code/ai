import React from 'react';
import { Check } from 'lucide-react';
import { TranslationDictionary } from '../data/translations';
import { AccessibilitySettings } from '../types';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
  onSelectStep?: (step: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  translations,
  accessibility,
  onSelectStep,
}) => {
  return (
    <div className="w-full bg-white dark:bg-stone-800 p-4 sm:p-5 rounded-3xl border border-amber-200 dark:border-stone-700 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {translations.guidedHeader}
        </span>
        <span className={`font-black text-stone-900 dark:text-stone-100 ${accessibility.largeText ? 'text-lg' : 'text-sm'}`}>
          {translations.stepIndicator(currentStep, totalSteps)}
        </span>
      </div>

      {/* Visual step nodes */}
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-4 right-4 h-1.5 -translate-y-1/2 bg-stone-200 dark:bg-stone-700 rounded-full -z-0" />
        {/* Active progress fill line */}
        <div
          className="absolute top-1/2 left-4 h-1.5 -translate-y-1/2 bg-emerald-600 transition-all duration-300 rounded-full -z-0"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 90}%` }}
        />

        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => {
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <button
              key={stepNum}
              onClick={() => onSelectStep?.(stepNum)}
              className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isCurrent
                  ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-200 dark:ring-emerald-950 scale-110'
                  : isCompleted
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-2 border-stone-300 dark:border-stone-600'
              }`}
              aria-label={`Go to Step ${stepNum}`}
            >
              {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : stepNum}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 px-1">
        <span>{translations.steps[0].title}</span>
        <span className="hidden sm:inline">{translations.steps[1].title}</span>
        <span className="hidden sm:inline">{translations.steps[2].title}</span>
        <span>{translations.steps[3].title}</span>
      </div>
    </div>
  );
};
