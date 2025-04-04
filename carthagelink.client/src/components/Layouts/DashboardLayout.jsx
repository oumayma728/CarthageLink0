import PropTypes from 'prop-types';
import { useState } from 'react';
import { Menu, X, Cpu, Key, Users, Wifi, Factory } from "lucide-react";
import { Link } from "react-router-dom";
//import ThemeToggle from '../common/themeToggle';
import Sidebar from './Sidebar/Sidebar'; // Import your Sidebar component

export default function DashboardLayout({ children, activePage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Theme Toggle */}
      

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-6 left-6 z-40 bg-white dark:bg-gray-800 p-2 rounded-md shadow border border-gray-200 dark:border-gray-700"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:transform-none w-64 bg-white dark:bg-gray-800 z-30 transition-transform duration-200 border-r border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 p-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-medium">Carthage Link</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              {[
                { name: "Devices", icon: <Cpu size={16} />, path: "/Device" },
                { name: "Factories", icon: <Factory size={16} />, path: "/Factory" },
                { name: "Licenses", icon: <Key size={16} />, path: "/License" },
                { name: "Users", icon: <Users size={16} />, path: "/User" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className={`flex items-center w-full p-3 rounded-md text-sm ${activePage === item.path 
                      ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
      />
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

// Prop type validation
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activePage: PropTypes.string.isRequired
};