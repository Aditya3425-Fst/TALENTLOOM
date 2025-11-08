const PostCard = ({ post, onClick }) => {
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

  return (
    <div
      onClick={onClick}
      className="group glass rounded-2xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-white/30 animate-fadeIn"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {post.title}
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold shadow-md ml-4 flex-shrink-0">
          <span>↑</span>
          <span>{post.votes || 0}</span>
        </div>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-3 text-lg leading-relaxed">
        {post.content}
      </p>
      <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
            {post.author?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-gray-600 font-medium">
            {post.author?.displayName || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {post.replies && (
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
              {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
            </span>
          )}
          <span className="font-medium">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

