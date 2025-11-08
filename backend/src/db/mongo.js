import mongoose from 'mongoose';
import { config } from '../config/env.js';

export const connectMongo = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log('MongoDB connected successfully');
    console.log(`Database: ${config.mongoUrl.split('/').pop()}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectMongo = async () => {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};


