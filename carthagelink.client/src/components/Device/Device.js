import { useState, useEffect } from "react";
import { 
    Menu, X, Factory, Cpu, Key, Users, Wifi, Edit3, Trash2, Wrench
} from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../themeToggle.js";

export default function Device() {
    const [devices, setDevices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [did, setDid] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    const fetchDevices = () => {
        setIsLoading(true);
        fetch("https://localhost:7086/api/Device", {
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setDevices(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                alert("Failed to fetch devices.");
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const openDeleteModal = (id) => {
        setDid(id);
        setIsModalOpen(true);
    };

    const deleteDevice = () => {
        fetch(`https://localhost:7086/api/Device/${did}`, { method: "DELETE" })
            .then((r) => {
                if (!r.ok) throw new Error("Delete failed");
                return r.json();
            })
            .then(() => {
                setIsModalOpen(false);
                fetchDevices();
            })
            .catch((e) => {
                console.log("Error deleting a Device", e);
                alert("Failed to delete Device.");
            });
    };

    const updateDeviceStatus = (id, currentStatus) => {
        setUpdatingStatusId(id);
        
        // Determine next status in the cycle
        let newStatus;
        switch(currentStatus) {
            case "Active":
                newStatus = "Inactive";
                break;
            case "Inactive":
                newStatus = "Maintenance";
                break;
            case "Maintenance":
                newStatus = "Active";
                break;
            default:
                newStatus = "Active";
        }

        fetch(`https://localhost:7086/api/Device/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        })
        .then(response => {
            if (!response.ok) throw new Error("Status update failed");
            return response.json();
        })
        .then(() => {
            fetchDevices(); // Refresh the list
        })
        .catch(error => {
            console.error("Update error:", error);
            alert("Failed to update status");
        })
        .finally(() => {
            setUpdatingStatusId(null);
        });
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case "Active":
                return {
                    bg: "bg-green-100 dark:bg-green-900/50",
                    text: "text-green-600 dark:text-green-400",
                    hover: "hover:bg-green-200 dark:hover:bg-green-800",
                    icon: null
                };
            case "Inactive":
                return {
                    bg: "bg-red-100 dark:bg-red-900/50",
                    text: "text-red-600 dark:text-red-400",
                    hover: "hover:bg-red-200 dark:hover:bg-red-800",
                    icon: null
                };
            case "Maintenance":
                return {
                    bg: "bg-yellow-100 dark:bg-yellow-900/50",
                    text: "text-yellow-600 dark:text-yellow-400",
                    hover: "hover:bg-yellow-200 dark:hover:bg-yellow-800",
                    icon: <Wrench className="w-3 h-3 mr-1" />
                };
            default:
                return {
                    bg: "bg-gray-100 dark:bg-gray-700",
                    text: "text-gray-600 dark:text-gray-300",
                    hover: "hover:bg-gray-200 dark:hover:bg-gray-600",
                    icon: null
                };
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* ... (previous sidebar and header code remains the same) ... */}

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h1 className="text-xl font-semibold mb-2 sm:mb-0">Devices</h1>
                        <Link 
                            to="/add-device"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                            Add Device
                        </Link>
                    </div>

                    {/* Devices Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr className="text-left text-xs text-gray-600 dark:text-gray-300">
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Mac Address</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Assigned Users</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="5" className="p-4 text-center text-sm text-gray-500">
                                                Loading devices...
                                            </td>
                                        </tr>
                                    ) : devices.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-4 text-center text-sm text-gray-500">
                                                No devices found
                                            </td>
                                        </tr>
                                    ) : (
                                        devices.map((device) => {
                                            const statusStyles = getStatusStyles(device.status);
                                            return (
                                                <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                                                        {device.name}
                                                    </td>
                                                    <td className="p-3 text-gray-600 dark:text-gray-300">
                                                        {device.macAddress}
                                                    </td>
                                                    <td className="p-3">
                                                        <button 
                                                            onClick={() => updateDeviceStatus(device.id, device.status)}
                                                            disabled={updatingStatusId === device.id}
                                                            className={`text-xs px-2 py-1 rounded flex items-center ${
                                                                updatingStatusId === device.id 
                                                                    ? "cursor-wait opacity-70" 
                                                                    : "cursor-pointer"
                                                            } ${statusStyles.bg} ${statusStyles.text} ${statusStyles.hover}`}
                                                        >
                                                            {statusStyles.icon}
                                                            {updatingStatusId === device.id ? "Updating..." : device.status}
                                                        </button>
                                                    </td>
                                                    <td className="p-3 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                                        {Array.isArray(device.assignedUsers) 
                                                            ? device.assignedUsers.join('\n') 
                                                            : device.assignedUsers || '/'}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                to={`/Edit?id=${device.id}`}
                                                                className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                                                            >
                                                                <Edit3 size={16} />
                                                            </Link>
                                                            <button
                                                                onClick={() => openDeleteModal(device.id)}
                                                                className="p-1.5 rounded bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal (remains the same) */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-80 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium mb-3">Delete Device</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Are you sure you want to delete this device?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteDevice}
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