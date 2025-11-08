import { useState } from 'react';
import { postsAPI } from '../lib/api.js';

const UpvoteButton = ({ post, onUpvote }) => {
  const [loading, setLoading] = useState(false);

  const handleUpvote = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      const response = await postsAPI.upvotePost(post._id);
      if (response.success) {
        onUpvote(response.post);
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleUpvote}
        disabled={loading}
        className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upvote"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>
      <span className="mt-2 text-2xl font-bold text-gray-700">{post.votes || 0}</span>
      <span className="text-xs text-gray-500 mt-1">votes</span>
    </div>
  );
};

export default UpvoteButton;
