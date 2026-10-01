import React from 'react';
import { LanguageCode, LanguageInfo, AccessibilitySettings } from '../types';
import { SUPPORTED_LANGUAGES, TranslationDictionary } from '../data/translations';
import { Check, Globe, Volume2 } from 'lucide-react';
import { speakText } from '../services/speech';

interface LanguageSelectorProps {
  currentLangCode: LanguageCode;
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
  onSelectLanguage: (code: LanguageCode) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLangCode,
  translations,
  accessibility,
  onSelectLanguage,
  isModal = false,
  onClose,
}) => {
  const handleLanguageClick = (lang: LanguageInfo) => {
    onSelectLanguage(lang.code);
    // Audio greeting confirmation in the chosen language
    speakText(lang.scriptExample, lang.speechCode, accessibility.slowSpeech);
    if (onClose) {
      onClose();
    }
  };

  const content = (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className={`font-bold text-stone-900 dark:text-stone-100 ${accessibility.largeText ? 'text-xl' : 'text-lg'}`}>
            {translations.selectLanguage}
          </h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
          12 Languages
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = lang.code === currentLangCode;
          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageClick(lang)}
              className={`relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                  : 'bg-white dark:bg-stone-800 border-amber-200/80 dark:border-stone-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/40'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`font-extrabold text-stone-900 dark:text-stone-100 ${accessibility.largeText ? 'text-lg' : 'text-base'}`}>
                  {lang.nativeName}
                </span>
                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">
                    {lang.code.toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                {lang.name}
              </span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 italic font-medium">
                "{lang.scriptExample}"
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 dark:border-stone-700">
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 px-3 py-1 rounded-xl text-sm font-semibold bg-stone-100 dark:bg-stone-800"
            >
              Done / முடிந்தது ✕
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-stone-800/80 p-4 rounded-3xl border border-amber-200 dark:border-stone-700 shadow-sm mb-6">
      {content}
    </div>
  );
};
