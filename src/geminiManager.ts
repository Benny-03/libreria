// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from '@google/genai';

export const gemini = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    config: {
      responseMimeType: 'application/json',
    },
  });

  return response.text;
};
