// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from "@google/genai";

export const gemini = async (prompt: string) => {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_KEY,
  });
  const config = {
    responseMimeType: "application/json",
  };
  const model = "gemini-2.5-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let result = "";
  for await (const chunk of response) {
    result += chunk.text;
  }

  return result;
};
