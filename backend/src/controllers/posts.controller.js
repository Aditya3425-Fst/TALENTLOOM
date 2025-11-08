import * as postsService from '../services/posts.service.js';
import { broadcastPostCreated, broadcastPostUpdated, broadcastPostDeleted, broadcastReplyCreated, broadcastReplyUpdated, broadcastReplyDelete } from '../sockets/index.js';

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.validated;
    const post = await postsService.createPost({
      title,
      content,
      authorId: req.user.id,
    });

    // Broadcast to all connected clients
    const io = req.app.locals.io;
    if (io) {
      broadcastPostCreated(io, post);
    }

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const { sort = 'recent', page = 1, limit = 10 } = req.query;
    const result = await postsService.getPosts({ sort, page, limit });
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postsService.getPostById(id);
    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const upvotePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postsService.upvotePost(id, req.user.id);

    // Broadcast to all connected clients
    const io = req.app.locals.io;
    if (io) {
      broadcastPostUpdated(io, post);
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const createReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.validated;
    const reply = await postsService.createReply({
      postId: id,
      content,
      authorId: req.user.id,
    });

    // Broadcast to all connected clients
    const io = req.app.locals.io;
    if (io) {
      broadcastReplyCreated(io, id, reply);
    }

    res.status(201).json({
      success: true,
      reply,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.validated;
    const post = await postsService.updatePost(id, req.user.id, { title, content });

    // Broadcast to all connected clients
    const io = req.app.locals.io;
    if (io) {
      broadcastPostUpdated(io, post);
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await postsService.deletePost(id, req.user.id);

    // Broadcast post deletion
    const io = req.app.locals.io;
    if (io) {
      broadcastPostDeleted(io, id);
    }

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const { content } = req.validated;
    const reply = await postsService.updateReply(replyId, req.user.id, { content });

    // Broadcast to all connected clients
    const io = req.app.locals.io;
    if (io) {
      broadcastReplyUpdated(io, reply.postId, reply);
    }

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    await postsService.deleteReply(replyId, req.user.id);

    // Broadcast reply deletion
    const io = req.app.locals.io;
    if (io) {
      broadcastReplyDelete(io, replyId);
    }

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

