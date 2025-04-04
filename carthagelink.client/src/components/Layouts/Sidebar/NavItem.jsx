import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChevronRight } from "lucide-react";

export default function NavItem({ item, isActive }) {
  return (
    <li>
      <Link
        to={item.path}
        className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? 'bg-blue-100/80 dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-inner'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <div className="flex items-center">
          <span className={`mr-3 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
            {item.icon}
          </span>
          {item.name}
        </div>
        {isActive && (
          <ChevronRight size={16} className="text-blue-500 dark:text-blue-400" />
        )}
      </Link>
    </li>
  );
}

NavItem.propTypes = {
  item: PropTypes.shape({
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired
};