import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true },
    username: { type: String, unique: true, sparse: true },
    displayName: { type: String, required: true, minlength: 2, maxlength: 40 },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const UserModel = mongoose.model('User', UserSchema);

// User operations
export const User = {
  async create(userData) {
    const user = await UserModel.create(userData);
    return {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
  },

  async findOne(query) {
    let user;
    // Handle $or queries
    if (query.$or) {
      user = await UserModel.findOne({ $or: query.$or }).lean();
    } else {
      user = await UserModel.findOne(query).lean();
    }
    if (!user) return null;
    return {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
  },

  async findById(id) {
    const user = await UserModel.findById(id).lean();
    if (!user) return null;
    return {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
  },
};

// Password hashing utility
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
