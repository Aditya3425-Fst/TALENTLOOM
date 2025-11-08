import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, minlength: 1, maxlength: 5000 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const ReplyModel = mongoose.model('Reply', ReplySchema);

// Reply operations
export const Reply = {
  async create(replyData) {
    const reply = await ReplyModel.create(replyData);
    return {
      _id: reply._id.toString(),
      postId: reply.postId.toString(),
      authorId: reply.authorId.toString(),
      content: reply.content,
      createdAt: reply.createdAt,
    };
  },

  async find(query = {}) {
    const mongoQuery = {};
    if (query.postId) {
      mongoQuery.postId = query.postId;
    }

    const replies = await ReplyModel.find(mongoQuery)
      .sort({ createdAt: 1 })
      .lean();

    return replies.map((reply) => ({
      _id: reply._id.toString(),
      postId: reply.postId.toString(),
      authorId: reply.authorId.toString(),
      content: reply.content,
      createdAt: reply.createdAt,
    }));
  },

  async findById(id) {
    const reply = await ReplyModel.findById(id).lean();
    if (!reply) return null;
    return {
      _id: reply._id.toString(),
      postId: reply.postId.toString(),
      authorId: reply.authorId.toString(),
      content: reply.content,
      createdAt: reply.createdAt,
    };
  },

  async findOneAndUpdate(id, update) {
    const reply = await ReplyModel.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).lean();
    if (!reply) return null;
    return {
      _id: reply._id.toString(),
      postId: reply.postId.toString(),
      authorId: reply.authorId.toString(),
      content: reply.content,
      createdAt: reply.createdAt,
    };
  },

  async findByIdAndDelete(id) {
    await ReplyModel.findByIdAndDelete(id);
  },

  async deleteMany(query) {
    await ReplyModel.deleteMany(query);
  },
};
