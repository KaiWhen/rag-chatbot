import client from "../db/mongo.ts";
import { getEmbedding } from './embed.service.ts';

export async function getQueryResults(query: string, filename: string) {    
    try {
        const queryEmbedding = await getEmbedding(query);

        await client.connect();
        const db = client.db("vector");
        const collection = db.collection("pdf");

        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    queryVector: queryEmbedding,
                    path: "embedding",
                    filter: {
                        filename: filename,
                    },
                    exact: true,
                    limit: 5
                }
            },
            {
                $project: {
                    _id: 0,
                    document: 1,
                }
            }
        ];

        const result = collection.aggregate(pipeline);

        const arrayOfQueryDocs = [];
        for await (const doc of result) {
            arrayOfQueryDocs.push(doc);
        }
        return arrayOfQueryDocs;
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log("An unknown error occurred.");
        }
    }
    finally {
        await client.close();
    }
}
