import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import client from '../db/mongo.js';
import { getEmbedding } from './embed.service.js';
import { Document as LCDocument } from '@langchain/core/documents';
import { vectorIndex } from './vector-index.service.js';

type VectorInsertDocument = {
  userId: string;
  filename: string;
  timestamp: number;
  document: LCDocument;
  embedding: number[];
};

export async function ingestData(filePath: string, filename: string) {
  try {
    const loader = new PDFLoader(filePath);
    const data = await loader.load();

    // Chunk the text from the PDF
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 20,
    });
    const docs = await textSplitter.splitDocuments(data);
    console.log(`Successfully chunked the PDF into ${docs.length} documents.`);

    await client.connect();
    const db = client.db('vector');
    const collection = db.collection('pdf');
    const existingCount = await collection.countDocuments({ filename: filename });
    if (existingCount > 0) {
      console.log(
        `Documents from file ${filename} already exist in the database. Skipping ingestion.`
      );
      return;
    }

    console.log('Generating embeddings and inserting documents...');
    const insertDocuments: VectorInsertDocument[] = [];
    const timestamp = Date.now();
    await Promise.all(
      docs.map(async (doc) => {
        const embedding = await getEmbedding(doc.pageContent);

        insertDocuments.push({
          userId: 'testUser',
          filename: filename,
          timestamp: timestamp,
          document: doc,
          embedding: embedding,
        });
      })
    );

    // Continue processing documents if an error occurs during an operation
    const options = { ordered: false };

    // Insert documents with embeddings into collection
    const result = await collection.insertMany(insertDocuments, options);
    console.log('Count of documents inserted: ' + result.insertedCount);

    await vectorIndex();
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    } else {
      console.log('An unknown error occurred.');
    }
  } finally {
    await client.close();
  }
}
