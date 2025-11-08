import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

export const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.frontendUrl,
      credentials: true,
    },
    path: '/forum',
  });

  // Socket authentication middleware (optional - allow anonymous connections for viewing)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.token;
      if (token) {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.userId);
        if (user) {
          socket.userId = user._id.toString();
          socket.user = {
            id: user._id.toString(),
            displayName: user.displayName,
          };
        }
      }
      // Allow connection even without auth (for viewing posts)
      next();
    } catch (error) {
      // Allow connection even if token is invalid (for viewing)
      next();
    }
  });

  io.on('connection', (socket) => {
    const userInfo = socket.user ? `${socket.user.displayName} (${socket.userId})` : 'Anonymous';
    console.log(`User connected: ${userInfo}`);

    // Handle post creation (optional - HTTP is primary method)
    socket.on('post:create', async (data) => {
      // This can be handled via HTTP, but socket allows it too
      // For now, we'll just acknowledge
      socket.emit('post:create:ack', { success: true });
    });

    // Handle reply creation (optional)
    socket.on('reply:create', async (data) => {
      socket.emit('reply:create:ack', { success: true });
    });

    // Handle upvote (optional)
    socket.on('post:upvote', async (data) => {
      socket.emit('post:upvote:ack', { success: true });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userInfo}`);
    });
  });

  return io;
};

// Helper to emit events to all connected clients
export const broadcastPostCreated = (io, post) => {
  io.emit('post:created', { post });
};

export const broadcastPostUpdated = (io, post) => {
  io.emit('post:updated', { post });
};

export const broadcastPostDeleted = (io, postId) => {
  io.emit('post:deleted', { postId });
};

export const broadcastReplyCreated = (io, postId, reply) => {
  io.emit('reply:created', { postId, reply });
};

export const broadcastReplyUpdated = (io, postId, reply) => {
  io.emit('reply:updated', { postId, reply });
};

export const broadcastReplyDelete = (io, replyId) => {
  io.emit('reply:deleted', { replyId });
};

