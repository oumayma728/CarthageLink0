// components/DashboardHeader.jsx
import { RefreshCw, Sun, Moon } from "lucide-react";
import PropTypes from 'prop-types';

export default function DashboardHeader({ 
  title, 
  darkMode, 
  onToggleTheme, 
  onRefresh, 
  loading 
}) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between p-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </header>
  );
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};