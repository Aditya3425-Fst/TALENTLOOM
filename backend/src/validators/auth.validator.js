import Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().email().optional(),
  username: Joi.string().alphanum().min(3).max(30).optional(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().min(2).max(40).required(),
}).or('email', 'username');

export const loginSchema = Joi.object({
  email: Joi.string().email().optional(),
  username: Joi.string().alphanum().optional(),
  password: Joi.string().required(),
}).or('email', 'username');


