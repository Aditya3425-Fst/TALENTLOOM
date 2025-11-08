import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/learnato',
  jwtSecret: process.env.JWT_SECRET || 'replace-me',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};


