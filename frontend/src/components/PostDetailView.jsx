import { useState } from 'react';
import { postsAPI } from '../lib/api.js';
import UpvoteButton from './UpvoteButton.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const PostDetailView = ({ post, onUpvote, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: post.title, content: post.content });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (date) => {
    if (!date) return 'Just now';
    try {
      const d = new Date(date);
      const now = new Date();
      const diff = now - d;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      return 'Just now';
    } catch {
      return 'Just now';
    }
  };

  const timeAgo = formatDate(post.createdAt);
  const isAuthor = user && post.authorId === user.id;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await postsAPI.updatePost(post._id, editData);
      if (response.success) {
        setIsEditing(false);
        onUpdate(response.post);
      } else {
        setError(response.error?.message || 'Failed to update post');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await postsAPI.deletePost(post._id);
      if (response.success) {
        onDelete();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 border border-white/30 shadow-2xl animate-fadeIn">
      <div className="flex gap-6">
        <UpvoteButton post={post} onUpvote={onUpvote} />
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {error}
                </div>
              )}
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-4 py-3 text-3xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 glass"
                required
                minLength={4}
                maxLength={120}
              />
              <textarea
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 glass resize-none"
                rows={8}
                required
                minLength={1}
                maxLength={10000}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({ title: post.title, content: post.content });
                  }}
                  className="px-6 py-2 glass border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-white/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                  {post.title}
                </h1>
                {isAuthor && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit post"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete post"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
              <div className="text-gray-700 whitespace-pre-wrap mb-6 text-lg leading-relaxed">
                {post.content}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                    {post.author?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {post.author?.displayName || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">{timeAgo}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailView;
