import React, { useState } from 'react';
import { TranslationDictionary } from '../data/translations';
import { AccessibilitySettings } from '../types';
import {
  X,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  Eye,
  Share2,
  Download,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: TranslationDictionary;
  accessibility: AccessibilitySettings;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  isOpen,
  onClose,
  translations,
  accessibility,
}) => {
  const [practiceStep, setPracticeStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-emerald-500 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {translations.practiceTitle}
              </h3>
              <p className="text-[11px] text-emerald-100">
                Safe Educational Sandbox • No Real Data Required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-100 transition"
            aria-label="Close practice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo explanation banner */}
        <div className="px-4 py-2 bg-amber-100 dark:bg-amber-950/80 border-b border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            Judge & User Simulation: See what DigiLocker actually looks like before visiting.
          </span>
          <span className="font-bold">Scene {practiceStep} of 3</span>
        </div>

        {/* Simulated Browser Window */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-stone-100 dark:bg-stone-950">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-300 dark:border-stone-700 shadow-md p-4 sm:p-5">
            {/* Simulated DigiLocker Browser Bar */}
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
              </div>
              <div className="flex-1 px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-center font-mono text-xs text-stone-600 dark:text-stone-300 flex items-center justify-center gap-1.5">
                <span className="text-emerald-600">🔒</span>
                <span>https://www.digilocker.gov.in</span>
              </div>
            </div>

            {/* SCENE 1: Finding Sign In / Sign Up */}
            {practiceStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-300 text-xs text-emerald-950 dark:text-emerald-200 font-semibold">
                  👉 <strong>Tip for first-time users:</strong> When you open the real DigiLocker site, look at the top right for "Sign In" or "Sign Up".
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-lg">DigiLocker</h4>
                    <p className="text-xs text-blue-200">Government of India</p>
                  </div>

                  <div className="relative">
                    {/* Glowing highlight indicator */}
                    <span className="absolute -inset-1 rounded-xl bg-amber-400 animate-ping opacity-75" />
                    <button className="relative px-4 py-2 rounded-xl bg-emerald-500 font-black text-xs text-white shadow-lg">
                      Sign In / Sign Up
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-xl text-center">
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Sahaayi will teach you what to do, but you will click this button directly on the official government website.
                  </p>
                </div>
              </div>
            )}

            {/* SCENE 2: The OTP Safety Warning */}
            {practiceStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400">
                  <div className="flex items-center gap-2 mb-2 text-rose-800 dark:text-rose-200 font-black text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <span>The Golden Security Rule</span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 font-medium">
                    When you enter your mobile number on the real website, government sends a 6-digit OTP to your phone.
                  </p>
                  <div className="mt-3 p-3 bg-white dark:bg-stone-900 rounded-xl border border-rose-300 font-mono text-center text-sm font-bold tracking-widest text-stone-800 dark:text-stone-100">
                    [ • • • • • • ]
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-400 mt-2 font-bold text-center">
                    ⚠️ NEVER tell this code to anyone on phone calls, WhatsApp, or in person.
                  </p>
                </div>
              </div>
            )}

            {/* SCENE 3: Issued Documents Dashboard */}
            {practiceStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-300 text-xs text-emerald-950 dark:text-emerald-200 font-semibold">
                  🎉 <strong>Inside DigiLocker:</strong> Here is how verified issued documents look once fetched.
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-800 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                          Class X Secondary Marksheet
                        </h5>
                        <p className="text-[10px] text-stone-500">State Board of Secondary Education</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-800 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🪪</span>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                          Aadhaar Card
                        </h5>
                        <p className="text-[10px] text-stone-500">Unique Identification Authority of India</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2 text-xs font-semibold text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> View</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</span>
                  <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Download</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Controls */}
        <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            onClick={() => setPracticeStep((p) => Math.max(1, p - 1))}
            disabled={practiceStep === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs disabled:opacity-40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {practiceStep < 3 ? (
            <button
              onClick={() => setPracticeStep((p) => Math.min(3, p + 1))}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            >
              <span>Next Scene</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            >
              Ready to return to Sahaayi ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
