import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Multilingual language name mapping
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  hi: 'Hindi (हिन्दी)',
  te: 'Telugu (తెలుగు)',
  bn: 'Bengali (বাংলা)',
  mr: 'Marathi (मराठी)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)',
  gu: 'Gujarati (ગુજરાતી)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
  as: 'Assamese (অসমীয়া)',
  or: 'Odia (ଓଡ଼ିଆ)',
};

// API Endpoint for multilingual voice / text assistant
app.post('/api/ask', async (req, res) => {
  try {
    const { query, language = 'en', currentStep } = req.body;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const targetLangName = LANGUAGE_NAMES[language] || 'English';

    // If Gemini API is configured, call gemini-3.8-flash
    if (ai) {
      const systemInstruction = `You are "Sahaayi" (சஹாயி / सहायी), an exceptionally gentle, respectful, and compassionate voice guide created for first-time rural women users in India accessing DigiLocker.
Target User:
- First-time smartphone user with little or no English and zero technical background.
- Nervous about making mistakes or losing money/documents.
- Desires digital independence to get education certificates, ration card, Aadhaar, driving licence, or government documents.

CRITICAL RULES:
1. Respond EXCLUSIVELY in ${targetLangName}.
2. Use ultra-simple, reassuring everyday spoken language. Avoid difficult technical words, acronyms, or rigid literal translations.
3. NEVER ask for Aadhaar number, OTP, password, phone number, or any personal credentials.
4. Reinforce that Sahaayi only guides them, and all actual government actions happen only on the official DigiLocker website (https://www.digilocker.gov.in/).
5. Structure your output strictly as a JSON object with:
   - "simpleExplanation": 1 or 2 warm, crystal-clear sentences explaining what is happening.
   - "whatToDoNow": 1 clear actionable step the user should do right now.
   - "audioScript": A calm, spoken script for Text-to-Speech narration in ${targetLangName} (warm, clear, friendly tone).
   - "suggestedStep": A number (1, 2, 3, or 4) if the query maps to DigiLocker steps (1: Open site, 2: Sign in/Safety, 3: Find document, 4: View/Share/Download), or null if general.

Example output JSON format:
{
  "simpleExplanation": "...",
  "whatToDoNow": "...",
  "audioScript": "...",
  "suggestedStep": 1
}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `User query: "${query}"\nUser's current guided step: ${currentStep || 'Home screen'}`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const text = response.text?.trim() || '';
        const parsed = JSON.parse(text);
        res.json({
          success: true,
          ...parsed,
          source: 'gemini',
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local guidance:', geminiError?.message);
        // Fallback is handled below
      }
    }

    // Local fallback response if Gemini is not set or errors
    const fallbackResponse = generateLocalGuidance(query, language);
    res.json({
      success: true,
      ...fallbackResponse,
      source: 'local_fallback',
    });
  } catch (error: any) {
    console.error('Server error handling /api/ask:', error);
    res.status(500).json({ error: 'Internal server error', details: error?.message });
  }
});

// Fallback guidance generator with native responses
function generateLocalGuidance(query: string, lang: string) {
  const q = query.toLowerCase();

  // Basic intent mapping
  const isAccount = q.includes('account') || q.includes('login') || q.includes('sign') || q.includes('கணக்கு') || q.includes('खाता') || q.includes('லாகின்');
  const isDocument = q.includes('document') || q.includes('certificate') || q.includes('marksheet') || q.includes('சான்றிதழ்') || q.includes('प्रमाणपत्र') || q.includes('aadhaar') || q.includes('ஆதார்');
  const isShare = q.includes('share') || q.includes('send') || q.includes('பகிர்') || q.includes('भेजें');

  if (lang === 'ta') {
    if (isAccount) {
      return {
        simpleExplanation: 'டிஜிலாக்கரில் உங்கள் மொபைல் எண் மற்றும் பாதுகாப்பான ஓடிபி மூலம் கணக்கு தொடங்கலாம்.',
        whatToDoNow: 'அதிகாரப்பூர்வ டிஜிலாக்கர் தளத்தில் "Sign In" அல்லது "Sign Up" என்பதை அழுத்தவும். உங்கள் ஓடிபியை யாரிடமும் பகிராதீர்கள்.',
        audioScript: 'டிஜிலாக்கரில் கணக்கு தொடங்க உங்கள் மொபைல் எண் தேவை. உங்கள் ஓடிபி ரகசியமானது, யாரிடமும் சொல்லாதீர்கள்.',
        suggestedStep: 2,
      };
    }
    if (isShare) {
      return {
        simpleExplanation: 'உங்கள் ஆவணங்களை நேரில் எடுத்துச் செல்லாமல், டிஜிலாக்கர் வழியாக பாதுகாப்பாக சரிபார்க்கப்பட்ட இணைப்பாக பகிரலாம்.',
        whatToDoNow: 'ஆவணத்தின் அருகில் உள்ள "Share" பொத்தானை அழுத்தி கல்லூரி அல்லது அலுவலகத்திற்கு அனுப்பவும்.',
        audioScript: 'ஆவணத்தைப் பகிர ஷேர் பொத்தானை அழுத்தி அனுப்பலாம்.',
        suggestedStep: 4,
      };
    }
    return {
      simpleExplanation: 'டிஜிலாக்கர் என்பது மத்திய அரசின் பாதுகாப்பான டிஜிட்டல் ஆவண பெட்டகம். இதில் உங்கள் பள்ளி சான்றிதழ், ஆதார், ஓட்டுநர் உரிமம் ஆகியவற்றை பெறலாம்.',
      whatToDoNow: 'முதலில் "அதிகாரப்பூர்வ டிஜிலாக்கரை திறக்க" என்ற பச்சை பொத்தானை அழுத்தி தொடங்குங்கள்.',
      audioScript: 'வணக்கம், பயப்பட வேண்டாம்! நாம் ஒன்றாக டிஜிலாக்கரை திறப்போம். கீழே உள்ள வழிகாட்டியைப் பின்பற்றுங்கள்.',
      suggestedStep: 1,
    };
  }

  if (lang === 'hi') {
    if (isAccount) {
      return {
        simpleExplanation: 'डिजीलॉकर में खाता बनाना बहुत आसान और सुरक्षित है। केवल आपका मोबाइल नंबर चाहिए।',
        whatToDoNow: 'आधिकारिक वेबसाइट पर जाकर "Sign In" या "Sign Up" पर क्लिक करें। अपना ओटीपी कभी किसी को न बताएं।',
        audioScript: 'डिजीलॉकर में अपना खाता बनाने के लिए साइन इन पर जाएं। ध्यान रहे, अपना ओटीपी किसी के साथ साझा न करें।',
        suggestedStep: 2,
      };
    }
    return {
      simpleExplanation: 'डिजीलॉकर भारत सरकार की एक सुरक्षित सेवा है जहाँ आपके सभी ज़रूरी दस्तावेज़ डिजिटल रूप में सुरक्षित रहते हैं।',
      whatToDoNow: 'पहले चरण से शुरू करें और आधिकारिक डिजीलॉकर वेबसाइट खोलें।',
      audioScript: 'चिंता न करें, हम मिलकर यह सीखेंगे। नीचे दिए गए पहले कदम पर क्लिक करें।',
      suggestedStep: 1,
    };
  }

  // English default
  return {
    simpleExplanation: 'DigiLocker is a secure Government of India digital service to store and access your official documents easily.',
    whatToDoNow: 'Start with Step 1 by opening the official DigiLocker website. Remember, never share your OTP with anyone.',
    audioScript: 'Hello! DigiLocker helps you keep all your certificates safe. Let us take it one simple step at a time.',
    suggestedStep: isAccount ? 2 : isDocument ? 3 : isShare ? 4 : 1,
  };
}

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Sahaayi Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
