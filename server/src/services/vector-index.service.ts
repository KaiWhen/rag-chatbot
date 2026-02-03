import client from '../db/mongo.ts';

export async function vectorIndex() {
  try {
    await client.connect();
    const db = client.db('vector');
    const collection = db.collection('pdf');

    const index = {
      name: 'vector_index',
      type: 'vectorSearch',
      definition: {
        fields: [
          {
            type: 'vector',
            path: 'embedding',
            similarity: 'cosine',
            numDimensions: 3072,
          },
          {
            type: 'filter',
            path: 'filename',
          },
        ],
      },
    };

    const result = await collection.createSearchIndex(index);
    return result;
  } finally {
    await client.close();
  }
}

export async function checkIndexStatus(filename: string) {
  try {
    await client.connect();
    const db = client.db('vector');
    const collection = db.collection('pdf');

    const indexes = await collection.listSearchIndexes().toArray();
    const indexExists = indexes.find((i) => i.name === 'vector_index');
    if (!indexExists) {
      return false;
    } else {
      const result = await collection
        .aggregate([
          {
            $vectorSearch: {
              index: 'vector_index',
              queryVector: new Array(3072).fill(0.001),
              path: 'embedding',
              filter: {
                filename: filename,
              },
              numCandidates: 100,
              limit: 1,
            },
          },
        ])
        .toArray();
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    }
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
