import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User, hashPassword, comparePassword } from '../models/User.js';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '24h' });
};

export const signup = async (data) => {
  const { email, username, password, displayName } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const error = new Error('User already exists with this email or username');
    error.code = 'CONFLICT';
    throw error;
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await User.create({
    email,
    username,
    displayName,
    passwordHash,
  });

  return {
    id: user._id.toString(),
    displayName: user.displayName,
  };
};

export const login = async (data) => {
  const { email, username, password } = data;

  // Find user
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.code = 'AUTH_REQUIRED';
    throw error;
  }

  // Verify password
  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    const error = new Error('Invalid credentials');
    error.code = 'AUTH_REQUIRED';
    throw error;
  }

  // Generate token
  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      displayName: user.displayName,
    },
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  return {
    id: user._id.toString(),
    displayName: user.displayName,
  };
};


