import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

type Libro = {
  id: string;
  titolo: string;
  autore: string;
  categoria: string;
  anno: number;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    const { libri }: { libri: Libro[] } = await req.json();

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
            temperature: 0.3,
        },
    });

    const prompt = `
    Sei un assistente esperto in libri per studi di commercialisti.
    Dai maggiore importanza ai libri contrassegnati come preferiti.

    Suggerisci 5 libri coerenti.

    Formato JSON:
    - isbn
    - titolo
    - autore
    - categoria
    - anno
    - piccola descrizione

    LIBRI: ${JSON.stringify(libri, null, 2)}`;

    const result = await model.generateContent(prompt);

    return Response.json({
        consigli: result.response.text(),
    });
}
