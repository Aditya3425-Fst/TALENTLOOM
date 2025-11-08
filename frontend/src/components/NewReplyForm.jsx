import { useState } from 'react';
import { postsAPI } from '../lib/api.js';

const NewReplyForm = ({ postId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await postsAPI.createReply(postId, { content });
      if (response.success) {
        setContent('');
        onSuccess(response.reply);
      } else {
        setError(response.error?.message || 'Failed to create reply');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/30 shadow-xl animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Add Reply
      </h2>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 glass resize-none"
            rows={4}
            placeholder="Write your reply..."
            required
            minLength={1}
            maxLength={5000}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform"
        >
          {loading ? 'Posting...' : 'Post Reply'}
        </button>
      </form>
    </div>
  );
};

export default NewReplyForm;
