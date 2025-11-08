import express from 'express';
import { createPostSchema, createReplySchema } from '../validators/post.validator.js';
import { validate } from '../middlewares/validate.js';
import { authMiddleware } from '../middlewares/auth.js';
import * as postsController from '../controllers/posts.controller.js';

const router = express.Router();

router.post('/', authMiddleware, validate(createPostSchema), postsController.createPost);
router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.put('/:id', authMiddleware, validate(createPostSchema), postsController.updatePost);
router.delete('/:id', authMiddleware, postsController.deletePost);
router.post('/:id/replies', authMiddleware, validate(createReplySchema), postsController.createReply);
router.post('/:id/upvote', authMiddleware, postsController.upvotePost);
router.put('/replies/:replyId', authMiddleware, validate(createReplySchema), postsController.updateReply);
router.delete('/replies/:replyId', authMiddleware, postsController.deleteReply);

export default router;


