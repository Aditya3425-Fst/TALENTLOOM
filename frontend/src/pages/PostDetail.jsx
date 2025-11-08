import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../lib/api.js';
import { getSocket } from '../lib/socket.js';
import PostDetailView from '../components/PostDetailView.jsx';
import ReplyList from '../components/ReplyList.jsx';
import NewReplyForm from '../components/NewReplyForm.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlePostUpdated = (data) => {
      if (data.post._id === id) {
        setPost((prev) => ({ ...prev, ...data.post }));
      }
    };

    const handleReplyCreated = (data) => {
      if (data.postId === id) {
        setPost((prev) => ({
          ...prev,
          replies: [...(prev.replies || []), data.reply],
        }));
      }
    };

    const handleReplyUpdated = (data) => {
      if (data.postId === id) {
        setPost((prev) => ({
          ...prev,
          replies: (prev.replies || []).map((r) =>
            r._id === data.reply._id ? data.reply : r
          ),
        }));
      }
    };

    const handleReplyDelete = (data) => {
      setPost((prev) => ({
        ...prev,
        replies: (prev.replies || []).filter((r) => r._id !== data.replyId),
      }));
    };

    const handlePostDeleted = (data) => {
      if (data.postId === id) {
        navigate('/');
      }
    };

    socket.on('post:updated', handlePostUpdated);
    socket.on('reply:created', handleReplyCreated);
    socket.on('reply:updated', handleReplyUpdated);
    socket.on('reply:deleted', handleReplyDelete);
    socket.on('post:deleted', handlePostDeleted);

    return () => {
      socket.off('post:updated', handlePostUpdated);
      socket.off('reply:created', handleReplyCreated);
      socket.off('reply:updated', handleReplyUpdated);
      socket.off('reply:deleted', handleReplyDelete);
      socket.off('post:deleted', handlePostDeleted);
    };
  }, [id, navigate]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPostById(id);
      if (response.success) {
        setPost(response.post);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError('Failed to load post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = (updatedPost) => {
    setPost(updatedPost);
  };

  const handlePostUpdate = (updatedPost) => {
    setPost({ ...post, ...updatedPost });
  };

  const handlePostDelete = () => {
    navigate('/');
  };

  const handleReplySuccess = (reply) => {
    setPost((prev) => ({
      ...prev,
      replies: [...(prev.replies || []), reply],
    }));
  };

  const handleReplyUpdate = (updatedReply) => {
    setPost((prev) => ({
      ...prev,
      replies: (prev.replies || []).map((r) =>
        r._id === updatedReply._id ? updatedReply : r
      ),
    }));
  };

  const handleReplyDelete = (replyId) => {
    setPost((prev) => ({
      ...prev,
      replies: (prev.replies || []).filter((r) => r._id !== replyId),
    }));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-500 mt-4 text-lg">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="glass rounded-2xl p-8 border border-white/30">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-500 text-xl mb-6">{error || 'Post not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 transform"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 glass border border-white/30 text-gray-700 rounded-lg hover:bg-white/50 transition-all duration-200 flex items-center gap-2"
      >
        ← Back to Posts
      </button>

      <PostDetailView
        post={post}
        onUpvote={handleUpvote}
        onUpdate={handlePostUpdate}
        onDelete={handlePostDelete}
      />

      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Replies ({post.replies?.length || 0})
        </h2>
        <ReplyList
          replies={post.replies || []}
          onUpdate={handleReplyUpdate}
          onDelete={handleReplyDelete}
        />
      </div>

      {user ? (
        <NewReplyForm postId={id} onSuccess={handleReplySuccess} />
      ) : (
        <div className="glass rounded-2xl p-6 text-center border border-white/30">
          <p className="text-gray-600 mb-4">
            Please{' '}
            <a href="/login" className="text-blue-600 hover:underline font-semibold">
              login
            </a>{' '}
            to reply
          </p>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
