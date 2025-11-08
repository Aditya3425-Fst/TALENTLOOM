import http from 'http';
import { connectMongo } from './db/mongo.js';
import { config } from './config/env.js';
import app from './app.js';
import { setupSocketIO } from './sockets/index.js';

const server = http.createServer(app);
const io = setupSocketIO(server);

// Make io available to routes via app.locals
app.locals.io = io;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Start server
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Database: MongoDB`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };


