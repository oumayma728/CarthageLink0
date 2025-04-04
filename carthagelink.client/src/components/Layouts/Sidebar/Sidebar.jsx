import PropTypes from 'prop-types';
import { Cpu, Key, Users, Factory, X} from "lucide-react";
import NavItem from './NavItem';
import ProfileDropdown from '../ProfileDropdown';

const navItems = [
  { name: "Devices", icon: <Cpu size={18} />, path: "/device" },
  { name: "Factories", icon: <Factory size={18} />, path: "/factory" },
  { name: "Licenses", icon: <Key size={18} />, path: "/license" },
  { name: "Users", icon: <Users size={18} />, path: "/user" },
];

export default function Sidebar({ isOpen, onClose, activePage = "" }) {
  return (
    <aside 
      className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 border-r border-gray-200 dark:border-gray-700 flex flex-col`}
      aria-hidden={!isOpen}
    >
      {/* Header */}
      <div className="p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
          Carthage Link
        </h2>
        <button 
          onClick={onClose} 
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePage && item.path && 
              activePage.toLowerCase().includes(item.path.toLowerCase());
            return (
              <NavItem 
                key={item.path} 
                item={item} 
                isActive={!!isActive} 
              />
            );
          })}
        </ul>
      </nav>
      
      {/* Profile section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
        <ProfileDropdown 
          user={{
          }}
        />
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  activePage: PropTypes.string
};

Sidebar.defaultProps = {
  activePage: ""
};