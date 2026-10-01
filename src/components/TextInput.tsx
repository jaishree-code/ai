import React, { useState } from 'react';
import { Send, Mic, Sparkles } from 'lucide-react';
import { TranslationDictionary } from '../data/translations';
import { AccessibilitySettings } from '../types';

interface TextInputProps {
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
  onSubmit: (text: string) => void;
  onSwitchToVoice: () => void;
  isLoading?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  translations,
  accessibility,
  onSubmit,
  onSwitchToVoice,
  isLoading = false,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      onSubmit(inputVal.trim());
      setInputVal('');
    }
  };

  const handleChipClick = (prompt: string) => {
    onSubmit(prompt);
  };

  return (
    <div className="w-full bg-white dark:bg-stone-800 p-5 rounded-3xl border border-amber-200 dark:border-stone-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold text-stone-900 dark:text-stone-100 ${accessibility.largeText ? 'text-xl' : 'text-lg'}`}>
          {translations.typeButton}
        </h3>
        <button
          onClick={onSwitchToVoice}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold hover:bg-emerald-100 transition"
        >
          <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{translations.voiceButton}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={translations.typePlaceholder}
          disabled={isLoading}
          className={`flex-1 px-4 py-3.5 rounded-2xl border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            accessibility.largeText ? 'text-lg' : 'text-base'
          }`}
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isLoading}
          className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white font-bold flex items-center justify-center gap-2 shadow-md transition disabled:cursor-not-allowed"
          aria-label={translations.sendQuery}
        >
          <Send className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">{translations.sendQuery}</span>
        </button>
      </form>

      {/* Suggested Quick Question Chips */}
      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/60">
        <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{translations.examplePromptsTitle}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {translations.quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(prompt)}
              className="text-xs font-medium text-stone-700 dark:text-stone-300 bg-amber-50 dark:bg-stone-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-950 border border-amber-200 dark:border-stone-600 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-xl px-3 py-2 text-left transition"
            >
              💬 "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
