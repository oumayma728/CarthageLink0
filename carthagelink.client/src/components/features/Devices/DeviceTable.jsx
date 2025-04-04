import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Edit3, Trash2, Wrench } from "lucide-react";

export default function DevicesTable({ devices, isLoading, onDelete, onStatusChange, updatingStatusId }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No devices found</p>
        <Link 
          to="/devices/new" 
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Device
        </Link>
      </div>
    );
  }

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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Mac Address</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Assigned Users</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {devices.map((device) => {
            const statusStyles = getStatusStyles(device.status);
            return (
              <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">
                  {device.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  {device.macAddress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => onStatusChange(device.id, device.status)}
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
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  {Array.isArray(device.assignedUsers) 
                    ? device.assignedUsers.join(', ') 
                    : device.assignedUsers || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/devices/edit/${device.id}`}
                      className="p-1.5 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      onClick={() => onDelete(device.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 dark:hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Prop type validation
DevicesTable.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      macAddress: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["Active", "Inactive", "Maintenance"]).isRequired,
      assignedUsers: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string
      ])
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  updatingStatusId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

DevicesTable.defaultProps = {
  updatingStatusId: null
};