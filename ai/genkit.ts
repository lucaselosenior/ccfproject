import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

if (process.env.NODE_ENV === 'production' && !process.env.GEMINI_API_KEY) {
  throw new Error(
    'A variável de ambiente GEMINI_API_KEY não está configurada no ambiente de produção.'
  );
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
