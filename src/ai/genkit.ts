import {genkit} from 'genkit';
import {googleAI} from '@gen-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-pro',
});
