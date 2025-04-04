import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
export default function UsersTable({ users, isLoading, onDelete }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No users found</p>
        <Link 
          to="/users/new" 
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New User
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Phone</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">License Key</th>
            <th className="px-6 py-3 text-left">Assigned Devices</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.phone || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded ${
                  user.role === "Admin" 
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700">
                  {user.licenseKey || "-"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.assignedDevices || '0'} devices
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-2">
                  <Link
                    to={`/users/edit/${user.id}`}
                    className="p-1.5 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                  >
                    <Edit3 size={16} />
                  </Link>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-1.5 text-red-600 hover:text-red-800 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

UsersTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      role: PropTypes.string.isRequired,
      licenseKey: PropTypes.string,
      assignedDevices: PropTypes.number
    })
  ),
  isLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired
};

UsersTable.defaultProps = {
  users: []
};