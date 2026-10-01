export type LanguageCode =
  | 'en'
  | 'ta'
  | 'hi'
  | 'te'
  | 'bn'
  | 'mr'
  | 'kn'
  | 'ml'
  | 'gu'
  | 'pa'
  | 'as'
  | 'or';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechCode: string; // e.g. 'ta-IN'
  scriptExample: string;
  flagOrIcon: string;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  autoReadAloud: boolean;
  slowSpeech: boolean;
}

export interface AssistantMessage {
  simpleExplanation: string;
  whatToDoNow: string;
  audioScript: string;
  suggestedStep?: number | null;
  source?: 'gemini' | 'local_fallback';
}

export type ViewMode = 'home' | 'guided' | 'practice';

export interface GuidedStepData {
  stepNumber: number;
  title: string;
  shortDesc: string;
  detailedInstruction: string;
  actionButtonLabel: string;
  voicePrompt: string;
  officialUrl?: string;
  warningNote?: string;
  examples?: Array<{ icon: string; title: string; desc: string }>;
  options?: Array<{ icon: string; title: string; desc: string }>;
}
