import React, { useState } from 'react';
import { AssistantMessage, AccessibilitySettings } from '../types';
import { TranslationDictionary } from '../data/translations';
import { Volume2, RotateCcw, ArrowRight, Sparkles, CheckCircle2, Square } from 'lucide-react';
import { speakText, stopSpeaking } from '../services/speech';

interface AssistantResponseProps {
  message: AssistantMessage;
  speechCode: string;
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
  onGoToStep?: (stepNumber: number) => void;
}

export const AssistantResponse: React.FC<AssistantResponseProps> = ({
  message,
  speechCode,
  translations,
  accessibility,
  onGoToStep,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleReadAloud = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const textToSpeak = `${message.simpleExplanation}. ${message.whatToDoNow}`;
    speakText(textToSpeak, speechCode, accessibility.slowSpeech, () => {
      setIsPlaying(false);
    });
  };

  const handleSayAgain = () => {
    stopSpeaking();
    setIsPlaying(true);
    const textToSpeak = `${message.simpleExplanation}. ${message.whatToDoNow}`;
    speakText(textToSpeak, speechCode, accessibility.slowSpeech, () => {
      setIsPlaying(false);
    });
  };

  return (
    <div className="w-full bg-gradient-to-br from-emerald-50 via-white to-amber-50/60 dark:from-stone-800 dark:via-stone-850 dark:to-stone-900 rounded-3xl p-5 sm:p-6 border-2 border-emerald-400 dark:border-emerald-600/60 shadow-lg relative my-4 animate-fade-in">
      {/* Header bar with badge & speaker controls */}
      <div className="flex items-center justify-between gap-2 border-b border-emerald-100 dark:border-stone-700/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
            स
          </span>
          <div>
            <h4 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200">
              {translations.appName} Guide
            </h4>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
              {message.source === 'gemini' ? 'Gemini Multilingual AI' : 'Verified Local Guidance'}
            </span>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
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
                <Volume2 className="w-3.5 h-3.5" />
                <span>{translations.readAloud}</span>
              </>
            )}
          </button>

          <button
            onClick={handleSayAgain}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-600 hover:bg-stone-100 text-xs font-semibold shadow-sm transition"
            title={translations.sayAgain}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{translations.sayAgain}</span>
          </button>
        </div>
      </div>

      {/* 💡 Simple Explanation */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
            {translations.simpleExplanationBadge}
          </span>
        </div>
        <p className={`text-stone-900 dark:text-stone-100 font-medium leading-relaxed ${accessibility.largeText ? 'text-xl' : 'text-base sm:text-lg'}`}>
          {message.simpleExplanation}
        </p>
      </div>

      {/* 👉 What to do now */}
      <div className="p-4 rounded-2xl bg-white/90 dark:bg-stone-800/90 border border-emerald-300 dark:border-emerald-700/80 shadow-sm mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
            {translations.whatToDoNowBadge}
          </span>
        </div>
        <p className={`text-stone-800 dark:text-stone-200 font-medium ${accessibility.largeText ? 'text-lg' : 'text-sm sm:text-base'}`}>
          {message.whatToDoNow}
        </p>
      </div>

      {/* Call to action: Direct Jump to Guided Step */}
      {message.suggestedStep && onGoToStep && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onGoToStep(message.suggestedStep!)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition"
          >
            <span>Step {message.suggestedStep}: {translations.steps[message.suggestedStep - 1]?.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
