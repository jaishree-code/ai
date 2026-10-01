import { AssistantMessage, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';

export async function askAssistant(
  query: string,
  language: LanguageCode,
  currentStep?: number
): Promise<AssistantMessage> {
  // First attempt: Call backend API powered by Gemini
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, currentStep }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.simpleExplanation && data.whatToDoNow) {
        return {
          simpleExplanation: data.simpleExplanation,
          whatToDoNow: data.whatToDoNow,
          audioScript: data.audioScript || data.simpleExplanation,
          suggestedStep: data.suggestedStep || null,
          source: data.source || 'gemini',
        };
      }
    }
  } catch (err) {
    console.warn('Network call to /api/ask failed, using instant local intelligence engine:', err);
  }

  // Robust Client-side Fallback
  return getLocalIntelligenceFallback(query, language, currentStep);
}

function getLocalIntelligenceFallback(
  query: string,
  language: LanguageCode,
  _currentStep?: number
): AssistantMessage {
  const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
  const q = query.toLowerCase();

  // Keyword intent detection
  const isDocument =
    q.includes('document') ||
    q.includes('certificate') ||
    q.includes('marksheet') ||
    q.includes('சான்றிதழ்') ||
    q.includes('ஆவணம்') ||
    q.includes('प्रमाणपत्र') ||
    q.includes('दस्तावेज़') ||
    q.includes('aadhaar') ||
    q.includes('ஆதார்') ||
    q.includes('आधार') ||
    q.includes('10th') ||
    q.includes('12th');

  const isAccount =
    q.includes('login') ||
    q.includes('sign in') ||
    q.includes('account') ||
    q.includes('password') ||
    q.includes('otp') ||
    q.includes('கணக்கு') ||
    q.includes('खाता') ||
    q.includes('লগইন');

  const isShare =
    q.includes('share') ||
    q.includes('send') ||
    q.includes('download') ||
    q.includes('பகிர்') ||
    q.includes('பதிவிறக்க') ||
    q.includes('भेजें') ||
    q.includes('डाउनलोड');

  if (isDocument) {
    return {
      simpleExplanation: `${dict.steps[2].shortDesc}`,
      whatToDoNow: `${dict.steps[2].detailedInstruction}`,
      audioScript: `${dict.steps[2].voicePrompt}`,
      suggestedStep: 3,
      source: 'local_fallback',
    };
  }

  if (isAccount) {
    return {
      simpleExplanation: `${dict.steps[1].shortDesc}`,
      whatToDoNow: `${dict.steps[1].detailedInstruction} ${dict.steps[1].warningNote || ''}`,
      audioScript: `${dict.steps[1].voicePrompt}`,
      suggestedStep: 2,
      source: 'local_fallback',
    };
  }

  if (isShare) {
    return {
      simpleExplanation: `${dict.steps[3].shortDesc}`,
      whatToDoNow: `${dict.steps[3].detailedInstruction}`,
      audioScript: `${dict.steps[3].voicePrompt}`,
      suggestedStep: 4,
      source: 'local_fallback',
    };
  }

  // Default introductory explanation
  return {
    simpleExplanation: dict.steps[0].shortDesc,
    whatToDoNow: dict.steps[0].detailedInstruction,
    audioScript: dict.steps[0].voicePrompt,
    suggestedStep: 1,
    source: 'local_fallback',
  };
}
