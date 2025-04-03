import { useState, useEffect } from "react";
import { 
  Menu, X, Factory, Cpu, Key, Users, Wifi, Server,  ChevronDown, XCircle, RefreshCw,
  Sun, Moon 
} from "lucide-react";

export default function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("SuperAdmin");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    devices: 0,
    factories: 0,
    users: 0,
    licenses:0,
    deviceTrend: [],
    factoryTrend: [],
    userTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference or use system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const countsResponse = await fetch('https://localhost:7086/api/Dashboard/counts');
      if (!countsResponse.ok) {
        const errorData = await countsResponse.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch counts');
      }
      const countsData = await countsResponse.json();
  
      setDashboardData({
        devices: countsData.devices || countsData.Devices || 0,
        factories: countsData.factories || countsData.Factories || 0,
        users: countsData.users || countsData.Users || 0,
        licenses: countsData.licenses || countsData.licenses || 0,
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to load dashboard data. Please try again.");
      
      setDashboardData(prev => ({
        ...prev,
        deviceTrend: [],
        factoryTrend: [],
        userTrend: []
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      try {
        const parsedRole = JSON.parse(role);
        setUserRole(parsedRole);
      } catch (e) {
        console.error("Error parsing role:", e);
      }
    }
  }, []);

  const StatCard = ({ title, value, icon, trend, change }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {value.toLocaleString()}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              )}
              <span className="font-medium ml-1">{Math.abs(change)}%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="md:hidden fixed top-6 left-6 z-50 bg-blue-600 dark:bg-blue-700 p-3 rounded-full text-white shadow-xl hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-72 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 z-40 transition-transform duration-300 shadow-2xl border-r border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col h-full p-5">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between mb-10 pt-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shadow-lg">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">Carthage Link</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {[
                { name: "Devices", icon: <Cpu className="w-5 h-5" />, href: "/Device" },
                { name: "Factories", icon: <Factory className="w-5 h-5" />, href: "/Factory" },
                { name: "Licenses", icon: <Key className="w-5 h-5" />, href: "/License" },
                { name: "Users", icon: <Users className="w-5 h-5" />, href: "/User" }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <div className="w-6 h-6 flex items-center justify-center mr-3">
                      {item.icon}
                    </div>
                    <span className="text-base font-medium">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile Dropdown */}
          <div className="mt-auto relative">
            <button 
              className="w-full p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shadow-sm">
                  {userRole ? userRole.charAt(0) : 'G'}
                </div>
                <div className="ml-3 text-left">
                  <p className="font-medium text-gray-800 dark:text-white">{userRole || 'Guest'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Super Admin</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute bottom-full mb-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                <a 
                  href="/profile" 
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Edit Profile
                </a>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-72">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between p-5">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={fetchData}
                disabled={loading}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <div className="relative w-64">
                <input 
                  type="text" 
                  placeholder="Search devices, factories..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="Connected Devices" 
              value={dashboardData.devices} 
              icon={<Cpu className="w-5 h-5" />}
            />
            <StatCard 
              title="Active Factories" 
              value={dashboardData.factories} 
              icon={<Factory className="w-5 h-5" />}
            />
            <StatCard 
              title="Registered Users" 
              value={dashboardData.users} 
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard 
              title="Active Licenses" 
              value={dashboardData.licenses} 
              icon={<Key className="w-5 h-5" />}
            />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { 
                    action: "New device connected", 
                    location: "Factory 12", 
                    time: "2 min ago", 
                    icon: <Cpu className="w-5 h-5 text-blue-500" /> 
                  },
                  { 
                    action: "Factory maintenance completed", 
                    location: "Factory 5", 
                    time: "15 min ago", 
                    icon: <Factory className="w-5 h-5 text-green-500" /> 
                  },
                  { 
                    action: "User permissions updated", 
                    location: "Admin Panel", 
                    time: "1 hour ago", 
                    icon: <Users className="w-5 h-5 text-purple-500" /> 
                  },
                  { 
                    action: "System update installed", 
                    location: "All Devices", 
                    time: "3 hours ago", 
                    icon: <Server className="w-5 h-5 text-yellow-500" /> 
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 group">
                    <div className="mt-1 mr-3 group-hover:scale-110 transition-transform">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">{activity.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.location}</p>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}