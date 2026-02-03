import client from "../db/mongo.ts";

export async function vectorIndex() {
    try {
      const database = client.db("vector");
      const collection = database.collection("pdf");
     
      const index = {
          name: "vector_index",
          type: "vectorSearch",
          definition: {
            "fields": [
              {
                "type": "vector",
                "path": "embedding",
                "similarity": "cosine",
                "numDimensions": 3072
              },
              {
                type: "filter",
                path: "filename"
              },
            ]
          }
      }
 
      await collection.dropIndex("vector_index").catch(() => {
        console.log("No existing index to drop.");
      });
      const result = await collection.createSearchIndex(index);
      console.log(result);
      return result;
    } finally {
      await client.close();
    }
}
