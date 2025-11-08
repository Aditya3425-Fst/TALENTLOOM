import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import { errorHandler } from './middlewares/error.js';
import path from 'path';

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,'../frontend/dist')));

  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend/dist/index.html'));
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

export default app;


