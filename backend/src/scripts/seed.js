import mongoose from 'mongoose';
import { config } from '../config/env.js';

// This script creates a small document in the 'learnato' database so
// the database appears in MongoDB Compass. Run with: node src/scripts/seed.js

async function run() {
  try {
    await mongoose.connect(config.mongoUrl);
    const db = mongoose.connection.db;
    const dbName = db.databaseName || (config.mongoUrl.split('/').pop());
    console.log('Connected to MongoDB, database:', dbName);

    // Create a collection and insert a document so the DB shows up in Compass
    const coll = db.collection('init_seed_collection');
    const res = await coll.insertOne({ seededAt: new Date(), note: 'seeded by script' });
    console.log('Inserted document id:', res.insertedId.toString());

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Seed script error:', err);
    process.exit(1);
  }
}

run();
