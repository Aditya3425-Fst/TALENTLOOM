import { useState } from 'react';
import { postsAPI } from '../lib/api.js';

const NewPostForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await postsAPI.createPost(formData);
      if (response.success) {
        setFormData({ title: '', content: '' });
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create post');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 border border-white/30 shadow-2xl animate-scaleIn">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Create New Post
      </h2>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 glass"
            placeholder="Enter post title..."
            required
            minLength={4}
            maxLength={120}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 glass resize-none"
            rows={6}
            placeholder="Write your post content..."
            required
            minLength={1}
            maxLength={10000}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 glass border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-white/50 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;
