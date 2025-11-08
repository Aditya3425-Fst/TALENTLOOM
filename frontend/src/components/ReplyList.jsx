import { useState } from 'react';
import { postsAPI } from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const ReplyList = ({ replies, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
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

  const handleEdit = (reply) => {
    setEditingId(reply._id);
    setEditContent(reply.content);
    setError('');
  };

  const handleUpdate = async (replyId) => {
    setError('');
    setLoading(true);

    try {
      const response = await postsAPI.updateReply(replyId, { content: editContent });
      if (response.success) {
        setEditingId(null);
        onUpdate(response.reply);
      } else {
        setError(response.error?.message || 'Failed to update reply');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update reply');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await postsAPI.deleteReply(replyId);
      if (response.success) {
        onDelete(replyId);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete reply');
    } finally {
      setLoading(false);
    }
  };

  if (!replies || replies.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-2xl border border-white/30">
        <div className="text-5xl mb-4">💭</div>
        <p className="text-gray-600 text-lg">No replies yet. Be the first to reply!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}
      {replies.map((reply, index) => {
        const timeAgo = formatDate(reply.createdAt);
        const isAuthor = user && reply.authorId === user.id;
        const isEditing = editingId === reply._id;

        return (
          <div
            key={reply._id}
            className="glass rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 animate-fadeIn"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 glass resize-none"
                  rows={4}
                  required
                  minLength={1}
                  maxLength={5000}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(reply._id)}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                    className="px-4 py-2 glass border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-white/50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed">
                  {reply.content}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {reply.author?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {reply.author?.displayName || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">{timeAgo}</div>
                    </div>
                  </div>
                  {isAuthor && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(reply)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit reply"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(reply._id)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete reply"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReplyList;
