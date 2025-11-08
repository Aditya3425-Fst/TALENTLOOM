import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../lib/api.js';
import { getSocket } from '../lib/socket.js';
import PostList from '../components/PostList.jsx';
import NewPostForm from '../components/NewPostForm.jsx';
import SortToggle from '../components/SortToggle.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('recent');
  const [showNewPost, setShowNewPost] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, [sort]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlePostCreated = (data) => {
      setPosts((prev) => [data.post, ...prev]);
      setShowNewPost(false);
    };

    const handlePostUpdated = (data) => {
      setPosts((prev) =>
        prev.map((post) => (post._id === data.post._id ? data.post : post))
      );
    };

    const handlePostDeleted = (data) => {
      setPosts((prev) => prev.filter((post) => post._id !== data.postId));
    };

    socket.on('post:created', handlePostCreated);
    socket.on('post:updated', handlePostUpdated);
    socket.on('post:deleted', handlePostDeleted);

    return () => {
      socket.off('post:created', handlePostCreated);
      socket.off('post:updated', handlePostUpdated);
      socket.off('post:deleted', handlePostDeleted);
    };
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts({ sort, page: 1, limit: 50 });
      if (response.success) {
        setPosts(response.posts || []);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };


  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleNewPostSuccess = () => {
    setShowNewPost(false);
    loadPosts();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Discussion Forum
          </h1>
          <p className="text-gray-600 text-lg">Share ideas, ask questions, and learn together</p>
        </div>
        <div className="flex gap-4 items-center">
          <SortToggle sort={sort} onSortChange={setSort} />
          {user && (
            <button
              onClick={() => setShowNewPost(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 transform flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              New Post
            </button>
          )}
        </div>
      </div>

      {showNewPost && (
        <div className="mb-8 animate-scaleIn">
          <NewPostForm
            onSuccess={handleNewPostSuccess}
            onCancel={() => setShowNewPost(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-500 mt-4 text-lg">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-white/30 animate-fadeIn">
          <div className="text-6xl mb-4">💭</div>
          <p className="text-gray-600 text-xl mb-6">No posts yet.</p>
          {user && (
            <button
              onClick={() => setShowNewPost(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 transform"
            >
              Create the first post!
            </button>
          )}
        </div>
      ) : (
        <PostList posts={posts} onPostClick={handlePostClick} />
      )}
    </div>
  );
};

export default Home;
