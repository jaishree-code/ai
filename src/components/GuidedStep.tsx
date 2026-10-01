import React, { useState } from 'react';
import { GuidedStepData, AccessibilitySettings } from '../types';
import { TranslationDictionary } from '../data/translations';
import {
  ExternalLink,
  ShieldAlert,
  Volume2,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Square,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { speakText, stopSpeaking } from '../services/speech';

interface GuidedStepProps {
  step: GuidedStepData;
  speechCode: string;
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
  onNext: () => void;
  onPrev: () => void;
  canPrev: boolean;
  onOpenPractice: () => void;
}

export const GuidedStep: React.FC<GuidedStepProps> = ({
  step,
  speechCode,
  translations,
  accessibility,
  onNext,
  onPrev,
  canPrev,
  onOpenPractice,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleReadAloud = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const textToSpeak = `${step.title}. ${step.shortDesc}. ${step.detailedInstruction} ${
      step.warningNote || ''
    }`;
    speakText(textToSpeak, speechCode, accessibility.slowSpeech, () => {
      setIsPlaying(false);
    });
  };

  const handleSayAgain = () => {
    stopSpeaking();
    setIsPlaying(true);
    const textToSpeak = `${step.title}. ${step.shortDesc}. ${step.detailedInstruction} ${
      step.warningNote || ''
    }`;
    speakText(textToSpeak, speechCode, accessibility.slowSpeech, () => {
      setIsPlaying(false);
    });
  };

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-3xl p-5 sm:p-7 border border-amber-200 dark:border-stone-700 shadow-sm animate-fade-in">
      {/* Step Header with Step Badge and Read Aloud Control */}
      <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-100 dark:border-stone-700">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow">
            {step.stepNumber}
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {translations.stepIndicator(step.stepNumber, 4)}
            </span>
            <h3 className={`font-black text-stone-900 dark:text-stone-100 tracking-tight leading-snug ${accessibility.largeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              {step.title}
            </h3>
          </div>
        </div>

        {/* Audio control buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isPlaying
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            aria-label={isPlaying ? translations.stopAudio : translations.readAloud}
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{translations.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">{translations.readAloud}</span>
              </>
            )}
          </button>

          <button
            onClick={handleSayAgain}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-200 transition"
            title={translations.sayAgain}
            aria-label={translations.sayAgain}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main explanation text */}
      <div className="space-y-4 mb-6">
        <p className={`font-semibold text-emerald-950 dark:text-emerald-300 ${accessibility.largeText ? 'text-xl' : 'text-base sm:text-lg'}`}>
          {step.shortDesc}
        </p>

        <p className={`text-stone-700 dark:text-stone-300 leading-relaxed font-normal ${accessibility.largeText ? 'text-lg' : 'text-sm sm:text-base'}`}>
          {step.detailedInstruction}
        </p>
      </div>

      {/* Step 1: Official Link Card with Verification Badge */}
      {step.stepNumber === 1 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-stone-900 border-2 border-emerald-400 dark:border-emerald-700 my-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {translations.officialBadge}
            </span>
            <span className="text-xs text-stone-500 font-mono">digilocker.gov.in</span>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mb-3">
            Clicking this will open the genuine Indian Government portal in a safe new window. When you are ready, come back here to continue.
          </p>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.digilocker.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition focus:outline-none focus:ring-4 focus:ring-emerald-400"
            >
              <span>{translations.openOfficialButton}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onOpenPractice}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{translations.completion.tryPractice}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Critical Safety Warning */}
      {step.stepNumber === 2 && step.warningNote && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 my-4 shadow-sm flex items-start gap-3">
          <ShieldAlert className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-rose-900 dark:text-rose-200 text-sm sm:text-base mb-1">
              Important Safety Rule
            </h4>
            <p className={`font-bold text-rose-800 dark:text-rose-300 ${accessibility.largeText ? 'text-lg' : 'text-sm'}`}>
              {step.warningNote}
            </p>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">
              If anyone calls you asking for OTP claiming to be DigiLocker or bank, cut the call immediately.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Visual Example Cards */}
      {step.stepNumber === 3 && step.examples && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {step.examples.map((ex, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-700/50 border border-stone-200 dark:border-stone-600 flex items-start gap-3"
            >
              <span className="text-2xl p-2 bg-white dark:bg-stone-800 rounded-xl shadow-xs">
                {ex.icon}
              </span>
              <div>
                <h5 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {ex.title}
                </h5>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  {ex.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 4: Three Document Usage Options */}
      {step.stepNumber === 4 && step.options && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {step.options.map((opt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center text-center"
            >
              <span className="text-3xl mb-2">{opt.icon}</span>
              <h5 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm mb-1">
                {opt.title}
              </h5>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {opt.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons: Previous and Next */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100 dark:border-stone-700 mt-6">
        {canPrev ? (
          <button
            onClick={onPrev}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-sm hover:bg-stone-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{translations.prevStepButton}</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-700/20 hover:shadow-xl transition transform active:scale-95"
        >
          <span>{step.actionButtonLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
