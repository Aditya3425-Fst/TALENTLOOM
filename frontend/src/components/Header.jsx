import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/30 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            💬 Learnato Forum
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full glass border border-white/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium hidden md:block">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 transform"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-gray-700 font-semibold rounded-full glass border border-white/30 hover:bg-white/50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 transform"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
