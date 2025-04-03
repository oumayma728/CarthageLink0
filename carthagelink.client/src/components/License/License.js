import { useState, useEffect } from "react";
import { Factory, Cpu, Key, Users, Wifi, Edit3, Trash2, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../themeToggle.js";

export default function License() {
    const [lid, setLid] = useState("");
    const [licenses, setLicenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLicenses = () => {
        setIsLoading(true);
        setError(null);
        fetch("https://localhost:7086/api/License", {
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setLicenses(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                setError(error.message);
                setLicenses([]);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchLicenses();
    }, []);

    const openDeleteModal = (id) => {
        setLid(id);
        setIsModalOpen(true);
    };

    const deleteLicense = () => {
        fetch(`https://localhost:7086/api/License/${lid}`, { method: "DELETE" })
            .then((r) => {
                if (!r.ok) throw new Error("Delete failed");
                return r.json();
            })
            .then(() => {
                setIsModalOpen(false);
                fetchLicenses();
            })
            .catch((e) => {
                console.log("Error deleting a License", e);
                alert("Failed to delete License.");
            });
    };

    // Utility function to convert status number to text
    const getStatusText = (status) => {
        return {
            0: "Active",
            1: "Expired",
            2: "Suspended",
            3: "Pending"
        }[status] || "Pending";
    };

    // Status badge component - updated to handle numeric status
    const StatusBadge = ({ status }) => {
        // Convert numeric status to text first
        const statusText = getStatusText(status);
        
        const statusConfig = {
            Active: {
                bg: "bg-green-100 dark:bg-green-900/50",
                text: "text-green-600 dark:text-green-400",
                dot: "bg-green-500"
            },
            Expired: {
                bg: "bg-red-100 dark:bg-red-900/50",
                text: "text-red-600 dark:text-red-400",
                dot: "bg-red-500"
            },
            Suspended: {
                bg: "bg-yellow-100 dark:bg-yellow-900/50",
                text: "text-yellow-600 dark:text-yellow-400",
                dot: "bg-yellow-500"
            },
            Pending: {
                bg: "bg-blue-100 dark:bg-blue-900/50",
                text: "text-blue-600 dark:text-blue-400",
                dot: "bg-blue-500"
            }
        };

        const config = statusConfig[statusText] || statusConfig.Pending;

        return (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></span>
                {statusText}
            </div>
        );
    };

    // Format date display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden fixed top-6 left-6 z-40 bg-white dark:bg-gray-800 p-2 rounded-md shadow border border-gray-200 dark:border-gray-700"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:transform-none w-64 bg-white dark:bg-gray-800 z-30 transition-transform duration-200 border-r border-gray-200 dark:border-gray-700`}>
        
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
                                { name: "Devices", icon: <Cpu size={16} />, href: "/Device" },
                                { name: "Factories", icon: <Factory size={16} />, href: "/Factory" },
                                { name: "Licenses", icon: <Key size={16} />, href: "/License", active: true },
                                { name: "Users", icon: <Users size={16} />, href: "/User" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link 
                                        to={item.href}
                                        className={`flex items-center w-full p-3 rounded-md text-sm ${item.active 
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

                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="mt-auto p-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-left"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h1 className="text-xl font-semibold mb-2 sm:mb-0">Licenses</h1>
                        <Link 
                            to="/AddLicense"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
                        >
                            <span>Add License</span>
                        </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                            Error: {error}
                        </div>
                    )}

                    {/* Licenses Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr className="text-left text-xs text-gray-600 dark:text-gray-300">
                                        <th className="p-4 font-medium">Key</th>
                                        <th className="p-4 font-medium">Assigned To</th>
                                        <th className="p-4 font-medium">Devices</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Created At</th>
                                        <th className="p-4 font-medium">Expires At</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="7" className="p-4 text-center text-sm text-gray-500">
                                                Loading licenses...
                                            </td>
                                        </tr>
                                    ) : !Array.isArray(licenses) || licenses.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="p-4 text-center text-sm text-gray-500">
                                                No licenses found
                                            </td>
                                        </tr>
                                    ) : (
                                        licenses.map((license) => (
                                            <tr key={license.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="p-4 text-gray-800 dark:text-gray-200 font-mono text-sm">
                                                    <span className="inline-block max-w-xs truncate hover:max-w-none hover:whitespace-normal hover:break-all">
                                                        {license.key}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-gray-800 dark:text-gray-200">
                                                        {license.assignedToName || license.assignedTo || 'Unassigned'}
                                                    </div>
                                                    {license.assignedToEmail && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {license.assignedToEmail}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                                    {license.devicesCount || '0'} devices
                                                </td>
                                                <td className="p-4">
                                                    <StatusBadge status={license.status} />
                                                </td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                                    {formatDate(license.createdAt)}
                                                </td>
                                                <td className="p-4">
                                                    <div className={`${getStatusText(license.status) === 'Expired' ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                                                        {formatDate(license.expiresAt)}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            to={`/Edit?id=${license.id}`}
                                                            className="p-2 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center justify-center"
                                                            title="Edit"
                                                        >
                                                            <Edit3 size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => openDeleteModal(license.id)}
                                                            className="p-2 rounded bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 flex items-center justify-center"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-80 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium mb-3">Delete License</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Are you sure you want to delete this license?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteLicense}
                                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}