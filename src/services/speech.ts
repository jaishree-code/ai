// Browser Speech Recognition and Speech Synthesis helper for Sahaayi

export interface SpeechRecognitionHandlers {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

// Global reference to track active recognition instance
let activeRecognition: any = null;

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const startListening = (
  speechCode: string,
  handlers: SpeechRecognitionHandlers
): (() => void) | null => {
  if (!isSpeechRecognitionSupported()) {
    handlers.onError?.('Speech recognition is not supported in this browser.');
    return null;
  }

  try {
    // Cancel existing session if any
    if (activeRecognition) {
      try {
        activeRecognition.abort();
      } catch (e) {
        // ignore
      }
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = speechCode;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      handlers.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript.trim()) {
        handlers.onResult(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      const errorMsg = event.error || 'Speech recognition error';
      // 'no-speech' is common and harmless
      if (event.error !== 'no-speech') {
        handlers.onError?.(errorMsg);
      }
    };

    recognition.onend = () => {
      activeRecognition = null;
      handlers.onEnd?.();
    };

    recognition.start();
    activeRecognition = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  } catch (err: any) {
    handlers.onError?.(err?.message || 'Failed to start speech recognition');
    return null;
  }
};

export const stopListening = () => {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch (e) {
      // ignore
    }
    activeRecognition = null;
  }
};

// Text-to-Speech (TTS)
export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const speakText = (
  text: string,
  speechCode: string,
  slowSpeech: boolean = false,
  onEnd?: () => void
): boolean => {
  if (!isSpeechSynthesisSupported() || !text) return false;

  try {
    window.speechSynthesis.cancel();

    // Clean text of emojis and symbols that speech synthesis might stumble on
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/https?:\/\/\S+/g, 'official website')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechCode;
    utterance.rate = slowSpeech ? 0.75 : 0.95; // calm, clear pace
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const exactVoice = voices.find((v) => v.lang.toLowerCase() === speechCode.toLowerCase());
      const langPrefix = speechCode.split('-')[0];
      const prefixVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      if (exactVoice) {
        utterance.voice = exactVoice;
      } else if (prefixVoice) {
        utterance.voice = prefixVoice;
      }
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn('Speech synthesis failed:', e);
    return false;
  }
};
