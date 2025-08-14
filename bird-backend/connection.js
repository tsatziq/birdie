/**
 * Connect to MongoDB.
 */

import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.ATLAS_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let connection;

try {
  connection = await client.connect();
} catch (error) {
  console.log(error);
}

const db = connection.db("birdie_db");

export default db;
