import Joi from 'joi';

export const createPostSchema = Joi.object({
  title: Joi.string().min(4).max(120).required(),
  content: Joi.string().min(1).max(10000).required(),
});

export const createReplySchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
});

export const listPostsSchema = Joi.object({
  sort: Joi.string().valid('recent', 'votes').default('recent'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});


