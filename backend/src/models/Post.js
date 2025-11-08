import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 4, maxlength: 120 },
    content: { type: String, required: true, minlength: 1, maxlength: 10000 },
    votes: { type: Number, default: 0 },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: false }
);

export const PostModel = mongoose.model('Post', PostSchema);

// Post operations
export const Post = {
  async create(postData) {
    const post = await PostModel.create({
      ...postData,
      votes: 0,
      voters: [],
    });
    return {
      _id: post._id ? post._id.toString() : null,
      title: post.title,
      content: post.content,
      votes: post.votes,
      voters: (post.voters || []).map((v) => (v ? v.toString() : v)),
      authorId: post.authorId ? post.authorId.toString() : null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  },

  async findById(id) {
    const post = await PostModel.findById(id).lean();
    if (!post) return null;
    return {
      _id: post._id ? post._id.toString() : null,
      title: post.title,
      content: post.content,
      votes: post.votes || 0,
      voters: (post.voters || []).map((v) => (v ? v.toString() : v)),
      authorId: post.authorId ? post.authorId.toString() : null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  },

  async find(query = {}) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const sortOption = query.sort === 'votes' 
      ? { votes: -1, createdAt: -1 }
      : { createdAt: -1 };

    const posts = await PostModel.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    return posts.map((post) => ({
      _id: post._id ? post._id.toString() : null,
      title: post.title,
      content: post.content,
      votes: post.votes || 0,
      voters: (post.voters || []).map((v) => (v ? v.toString() : v)),
      authorId: post.authorId ? post.authorId.toString() : null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  },

  async findOneAndUpdate(id, update) {
    const post = await PostModel.findByIdAndUpdate(
      id,
      { ...update, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    if (!post) return null;
    return {
      _id: post._id ? post._id.toString() : null,
      title: post.title,
      content: post.content,
      votes: post.votes || 0,
      voters: (post.voters || []).map((v) => (v ? v.toString() : v)),
      authorId: post.authorId ? post.authorId.toString() : null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  },

  async countDocuments() {
    return PostModel.countDocuments();
  },

  async findByIdAndDelete(id) {
    await PostModel.findByIdAndDelete(id);
  },
};
