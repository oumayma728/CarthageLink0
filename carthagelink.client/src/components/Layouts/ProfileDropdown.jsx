import PropTypes from 'prop-types';
import { useState } from 'react';
import { ChevronDown, User, LogOut, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfileDropdown({ 
  user = {
    name: 'Guest',
    role: 'Guest',
    email: null,
    avatarInitial: 'G'
  },
  onLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Safely get user data with fallbacks
  const userName = user?.name || 'Guest';
  const userRole = user?.role || 'Guest';
  const userEmail = user?.email;
  const avatarInitial = user?.avatarInitial || userName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button 
        className="w-full p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-3"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Profile menu"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shadow-sm">
            {avatarInitial}
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-800 dark:text-white text-sm truncate max-w-[120px]">
              {userName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
              {userRole}
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
              {userName}
            </p>
            {userEmail && (
              <div className="flex items-center mt-1">
                <Mail className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userEmail}
                </p>
              </div>
            )}
          </div>
          
          <Link
            to="/profile"
            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-3" />
            Edit Profile
          </Link>
          
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

ProfileDropdown.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    avatarInitial: PropTypes.string,
  }),
  onLogout: PropTypes.func,
};

ProfileDropdown.defaultProps = {
  user: {
    name: 'Guest',
    role: 'Guest',
    email: null,
    avatarInitial: null
  },
  onLogout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};