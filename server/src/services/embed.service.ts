import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// generate embeddings from OpenAI
export async function getEmbedding(text: string) {
  const results = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  });

  if (!results.embeddings || results.embeddings.length === 0) {
    throw new Error('Gemini embedding returned no data');
  }

  const embedding = results.embeddings[0]?.values;

  if (!embedding) {
    throw new Error('Gemini embedding missing embedding vector');
  }

  return embedding;
}
