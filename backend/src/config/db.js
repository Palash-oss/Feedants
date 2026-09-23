import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants_competition';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] Connected to MongoDB at: ${uri}`);
    return uri;
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB at (${uri}). Spinning up in-memory MongoDB server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to MongoMemoryServer at: ${memUri}`);
      return memUri;
    } catch (memErr) {
      console.error('[Database] Failed to connect to MongoMemoryServer:', memErr);
      throw memErr;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
