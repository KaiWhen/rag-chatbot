import { getQueryResults } from './retrieve.service.ts';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function generateResponse(question: string, filename: string) {
  try {
    const documents = await getQueryResults(question, filename);

    let textDocuments = '';
    if (!documents || documents.length === 0) {
      return 'No relevant documents found to answer the question.';
    }

    documents?.forEach((doc) => {
      textDocuments += doc.document.pageContent;
    });

    const prompt = `
        You are a retrieval-augmented AI system.

        Rules:
        - Use ONLY the provided context
        - Do NOT use outside knowledge
        - Be concise and factual

        Answer the following question based on the given context.
        Question:
        ${question}

        Context:
        ${textDocuments}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    if (!response || !response.text) {
      return 'Failed to generate a response from the language model.';
    }
    return response.text;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    } else {
      console.log('An unknown error occurred.');
    }
  }
}
