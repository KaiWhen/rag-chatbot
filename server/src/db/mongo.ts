
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGODB_URI || "";

const client = new MongoClient(uri);

export default client;