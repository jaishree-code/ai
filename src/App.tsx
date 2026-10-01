import React, { useState, useEffect } from 'react';
import {
  LanguageCode,
  AccessibilitySettings,
  AssistantMessage,
  ViewMode,
} from './types';
import {
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
} from './data/translations';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { VoiceInput } from './components/VoiceInput';
import { TextInput } from './components/TextInput';
import { AssistantResponse } from './components/AssistantResponse';
import { ProgressBar } from './components/ProgressBar';
import { GuidedStep } from './components/GuidedStep';
import { CompletionScreen } from './components/CompletionScreen';
import { TrustPanel } from './components/TrustPanel';
import { AccessibilityControls } from './components/AccessibilityControls';
import { PracticeModal } from './components/PracticeModal';
import { AboutSection } from './components/AboutSection';
import { askAssistant } from './services/aiService';
import { speakText, stopSpeaking } from './services/speech';
import {
  FileText,
  KeyRound,
  Share2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  // Core state
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [inputMode, setInputMode] = useState<'voice' | 'type'>('voice');
  const [assistantMessage, setAssistantMessage] = useState<AssistantMessage | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Modals
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState<boolean>(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState<boolean>(false);

  // Accessibility settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    largeText: false,
    highContrast: false,
    autoReadAloud: false,
    slowSpeech: false,
  });

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  // Sync theme with accessibility high-contrast setting
  useEffect(() => {
    if (accessibility.highContrast) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [accessibility.highContrast]);

  // Handle auto-narration when entering guided steps
  useEffect(() => {
    if (viewMode === 'guided' && accessibility.autoReadAloud) {
      const stepData = t.steps[currentStep - 1];
      if (stepData) {
        speakText(
          `${stepData.title}. ${stepData.shortDesc}. ${stepData.detailedInstruction}`,
          currentLang.speechCode,
          accessibility.slowSpeech
        );
      }
    }
  }, [viewMode, currentStep, selectedLanguage]);

  // Handle user speech or text query
  const handleQuerySubmit = async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsAiLoading(true);
    try {
      const response = await askAssistant(
        queryText,
        selectedLanguage,
        viewMode === 'guided' ? currentStep : undefined
      );
      setAssistantMessage(response);

      // Read aloud the response
      if (response.audioScript) {
        speakText(response.audioScript, currentLang.speechCode, accessibility.slowSpeech);
      }
    } catch (err) {
      console.error('Error getting response:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quick visual cards on home screen
  const handleVisualCardClick = (targetStep: number) => {
    stopSpeaking();
    setCurrentStep(targetStep);
    setViewMode('guided');
    setAssistantMessage(null);
  };

  const handleNextStep = () => {
    stopSpeaking();
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Completed!
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    stopSpeaking();
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStartAgain = () => {
    stopSpeaking();
    setCurrentStep(1);
    setViewMode('guided');
  };

  const handleGoHome = () => {
    stopSpeaking();
    setViewMode('home');
    setCurrentStep(1);
    setAssistantMessage(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        accessibility.highContrast
          ? 'bg-stone-950 text-stone-100'
          : 'bg-[#faf8f4] text-stone-900'
      }`}
    >
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        translations={t}
        accessibility={accessibility}
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        onToggleAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenPractice={() => setIsPracticeOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col">
        {/* HOME VIEW */}
        {viewMode === 'home' && (
          <div className="space-y-6 animate-fade-in">
            {/* Hero Welcome Banner */}
            <div className="text-center max-w-xl mx-auto space-y-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {currentLang.nativeName} • {currentLang.name}
              </span>

              <h1 className={`font-black tracking-tight text-stone-900 dark:text-stone-100 ${accessibility.largeText ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
                {t.appName}
              </h1>

              <p className={`font-bold text-emerald-800 dark:text-emerald-300 ${accessibility.largeText ? 'text-xl' : 'text-base sm:text-lg'}`}>
                “{t.appTagline}”
              </p>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                {t.appSubtitle}
              </p>
            </div>

            {/* Extremely Visible Language Selector (as strictly requested) */}
            <LanguageSelector
              currentLangCode={selectedLanguage}
              translations={t}
              accessibility={accessibility}
              onSelectLanguage={(code) => setSelectedLanguage(code)}
            />

            {/* Voice or Type Interface */}
            {inputMode === 'voice' ? (
              <VoiceInput
                speechCode={currentLang.speechCode}
                translations={t}
                accessibility={accessibility}
                onTranscriptSubmitted={handleQuerySubmit}
                onSwitchToType={() => setInputMode('type')}
              />
            ) : (
              <TextInput
                translations={t}
                accessibility={accessibility}
                onSubmit={handleQuerySubmit}
                onSwitchToVoice={() => setInputMode('voice')}
                isLoading={isAiLoading}
              />
            )}

            {/* Assistant AI Response display if present */}
            {assistantMessage && (
              <AssistantResponse
                message={assistantMessage}
                speechCode={currentLang.speechCode}
                translations={t}
                accessibility={accessibility}
                onGoToStep={(step) => {
                  stopSpeaking();
                  setCurrentStep(step);
                  setViewMode('guided');
                }}
              />
            )}

            {/* 4 Large Visual Action Buttons (Required by prompt) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className={`font-black text-stone-900 dark:text-stone-100 ${accessibility.largeText ? 'text-xl' : 'text-lg'}`}>
                  {t.mainQuestion}
                </h3>
                <span className="text-xs font-semibold text-stone-500">
                  Tap to begin guide
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 📄 Get a document */}
                <button
                  onClick={() => handleVisualCardClick(3)}
                  className="flex items-start gap-4 p-5 rounded-3xl bg-white dark:bg-stone-800 border-2 border-emerald-300 dark:border-stone-700 hover:border-emerald-500 hover:shadow-md transition text-left group focus:outline-none focus:ring-4 focus:ring-emerald-400"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-black text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition ${accessibility.largeText ? 'text-xl' : 'text-base sm:text-lg'}`}>
                      📄 {t.visualActions.getDocument.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                      {t.visualActions.getDocument.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 shrink-0 self-center" />
                </button>

                {/* 🔐 Create / access DigiLocker */}
                <button
                  onClick={() => handleVisualCardClick(2)}
                  className="flex items-start gap-4 p-5 rounded-3xl bg-white dark:bg-stone-800 border-2 border-amber-300 dark:border-stone-700 hover:border-emerald-500 hover:shadow-md transition text-left group focus:outline-none focus:ring-4 focus:ring-emerald-400"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-black text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition ${accessibility.largeText ? 'text-xl' : 'text-base sm:text-lg'}`}>
                      🔐 {t.visualActions.createAccess.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                      {t.visualActions.createAccess.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 shrink-0 self-center" />
                </button>

                {/* 📤 Share a document */}
                <button
                  onClick={() => handleVisualCardClick(4)}
                  className="flex items-start gap-4 p-5 rounded-3xl bg-white dark:bg-stone-800 border-2 border-teal-300 dark:border-stone-700 hover:border-emerald-500 hover:shadow-md transition text-left group focus:outline-none focus:ring-4 focus:ring-emerald-400"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-black text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition ${accessibility.largeText ? 'text-xl' : 'text-base sm:text-lg'}`}>
                      📤 {t.visualActions.shareDoc.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                      {t.visualActions.shareDoc.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 shrink-0 self-center" />
                </button>

                {/* ❓ I don't know where to start */}
                <button
                  onClick={() => handleVisualCardClick(1)}
                  className="flex items-start gap-4 p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-stone-800 dark:to-stone-850 border-2 border-emerald-400 dark:border-emerald-700 hover:border-emerald-600 hover:shadow-md transition text-left group focus:outline-none focus:ring-4 focus:ring-emerald-400"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-black text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition ${accessibility.largeText ? 'text-xl' : 'text-base sm:text-lg'}`}>
                      ❓ {t.visualActions.dontKnow.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                      {t.visualActions.dontKnow.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 shrink-0 self-center" />
                </button>
              </div>
            </div>

            {/* Trust and Safety Section */}
            <TrustPanel translations={t} accessibility={accessibility} />
          </div>
        )}

        {/* GUIDED FLOW VIEW */}
        {viewMode === 'guided' && (
          <div className="space-y-4 animate-fade-in">
            {/* Top Back to Home Button */}
            <div className="flex items-center justify-between pb-2">
              <button
                onClick={handleGoHome}
                className="text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 transition"
              >
                <span>{t.backToHome}</span>
              </button>

              <button
                onClick={() => setIsPracticeOpen(true)}
                className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.completion.tryPractice}</span>
              </button>
            </div>

            {/* If in steps 1 to 4, show progress bar and step */}
            {currentStep <= 4 ? (
              <>
                <ProgressBar
                  currentStep={currentStep}
                  totalSteps={4}
                  translations={t}
                  accessibility={accessibility}
                  onSelectStep={(step) => {
                    stopSpeaking();
                    setCurrentStep(step);
                  }}
                />

                <GuidedStep
                  step={t.steps[currentStep - 1]}
                  speechCode={currentLang.speechCode}
                  translations={t}
                  accessibility={accessibility}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  canPrev={currentStep > 1}
                  onOpenPractice={() => setIsPracticeOpen(true)}
                />
              </>
            ) : (
              /* Step 5 = Completion Celebration Screen */
              <CompletionScreen
                speechCode={currentLang.speechCode}
                translations={t}
                accessibility={accessibility}
                onStartAgain={handleStartAgain}
                onGoHome={handleGoHome}
                onOpenPractice={() => setIsPracticeOpen(true)}
              />
            )}

            {/* Trust and Safety Banner always accessible during guide */}
            <div className="mt-8">
              <TrustPanel translations={t} accessibility={accessibility} />
            </div>
          </div>
        )}
      </main>

      {/* About Section & Hackathon Details Footer */}
      <AboutSection translations={t} accessibility={accessibility} />

      {/* Modals */}
      {isLangModalOpen && (
        <LanguageSelector
          currentLangCode={selectedLanguage}
          translations={t}
          accessibility={accessibility}
          onSelectLanguage={(code) => setSelectedLanguage(code)}
          isModal={true}
          onClose={() => setIsLangModalOpen(false)}
        />
      )}

      {isAccessibilityOpen && (
        <AccessibilityControls
          settings={accessibility}
          translations={t}
          onChange={(updated) => setAccessibility((prev) => ({ ...prev, ...updated }))}
          isOpen={isAccessibilityOpen}
          onClose={() => setIsAccessibilityOpen(false)}
        />
      )}

      {isPracticeOpen && (
        <PracticeModal
          isOpen={isPracticeOpen}
          onClose={() => setIsPracticeOpen(false)}
          translations={t}
          accessibility={accessibility}
        />
      )}
    </div>
  );
}
