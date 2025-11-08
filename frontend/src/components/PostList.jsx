import PostCard from './PostCard.jsx';

const PostList = ({ posts, onPostClick }) => {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div
          key={post._id}
          className="animate-fadeIn"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <PostCard post={post} onClick={() => onPostClick(post._id)} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
