import express from 'express';
import { signupSchema, loginSchema } from '../validators/auth.validator.js';
import { validate } from '../middlewares/validate.js';
import { authMiddleware } from '../middlewares/auth.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);

export default router;


