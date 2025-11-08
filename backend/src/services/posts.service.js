import { Post, PostModel } from '../models/Post.js';
import { Reply, ReplyModel } from '../models/Reply.js';
import { User } from '../models/User.js';

const formatPost = async (post) => {
  // Get author info
  const author = await User.findById(post.authorId);
  return {
    _id: post._id,
    title: post.title,
    content: post.content,
    votes: post.votes || 0,
    voters: post.voters || [],
    authorId: post.authorId,
    author: author ? {
      id: author._id,
      displayName: author.displayName,
    } : null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

const formatReply = async (reply) => {
  const author = await User.findById(reply.authorId);
  return {
    _id: reply._id,
    postId: reply.postId,
    content: reply.content,
    authorId: reply.authorId,
    author: author ? {
      id: author._id,
      displayName: author.displayName,
    } : null,
    createdAt: reply.createdAt,
  };
};

export const createPost = async (data) => {
  const { title, content, authorId } = data;
  const post = await Post.create({ title, content, authorId });
  return await formatPost(post);
};

export const getPosts = async (query) => {
  const { sort = 'recent', page = 1, limit = 10 } = query;
  const posts = await Post.find({ sort, page: parseInt(page), limit: parseInt(limit) });
  const total = await Post.countDocuments();
  
  // Format posts with author info
  const formattedPosts = await Promise.all(posts.map(formatPost));
  
  return { posts: formattedPosts, total, page: parseInt(page), limit: parseInt(limit) };
};

export const getPostById = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Get replies
  const replies = await Reply.find({ postId });
  const formattedReplies = await Promise.all(replies.map(formatReply));

  const formattedPost = await formatPost(post);
  return {
    ...formattedPost,
    replies: formattedReplies,
  };
};

export const upvotePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Check if user already voted
  const userIdStr = userId.toString();
  const hasVoted = Array.isArray(post.voters) && post.voters.includes(userIdStr);

  if (!hasVoted) {
    // Add vote
    const updatedVoters = [...(post.voters || []), userIdStr];
    const updatedVotes = (post.votes || 0) + 1;
    await Post.findOneAndUpdate(postId, {
      voters: updatedVoters,
      votes: updatedVotes,
    });
  }

  // Return updated post
  const updatedPost = await Post.findById(postId);
  return await formatPost(updatedPost);
};

export const createReply = async (data) => {
  const { postId, content, authorId } = data;

  // Verify post exists
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  const reply = await Reply.create({ postId, content, authorId });
  return await formatReply(reply);
};

export const updatePost = async (postId, userId, data) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Check if user is the author
  if (post.authorId.toString() !== userId.toString()) {
    const error = new Error('Unauthorized');
    error.code = 'AUTH_REQUIRED';
    throw error;
  }

  const updatedPost = await Post.findOneAndUpdate(postId, {
    title: data.title,
    content: data.content,
  });
  return await formatPost(updatedPost);
};

export const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Check if user is the author
  if (post.authorId.toString() !== userId.toString()) {
    const error = new Error('Unauthorized');
    error.code = 'AUTH_REQUIRED';
    throw error;
  }

  // Delete post and all its replies
  await PostModel.findByIdAndDelete(postId);
  await ReplyModel.deleteMany({ postId });

  return { success: true };
};

export const updateReply = async (replyId, userId, data) => {
  const replyData = await Reply.findById(replyId);

  if (!replyData) {
    const error = new Error('Reply not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Check if user is the author
  if (replyData.authorId.toString() !== userId.toString()) {
    const error = new Error('Unauthorized');
    error.code = 'AUTH_REQUIRED';
    throw error;
  }

  // Update reply
  const updated = await Reply.findOneAndUpdate(replyId, { content: data.content });
  return await formatReply(updated);
};

export const deleteReply = async (replyId, userId) => {
  const replyData = await Reply.findById(replyId);

  if (!replyData) {
    const error = new Error('Reply not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Check if user is the author
  if (replyData.authorId.toString() !== userId.toString()) {
    const error = new Error('Unauthorized');
    error.code = 'AUTH_REQUIRED';
    throw error;
  }

  // Delete reply
  await Reply.findByIdAndDelete(replyId);

  return { success: true };
};

