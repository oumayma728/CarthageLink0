import { Link } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PropTypes from 'prop-types';

function LicensesTable({ licenses, isLoading, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!licenses?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No licenses found</p>
        <Link 
          to="/add-license" 
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New License
        </Link>
      </div>
    );
  }

  return (
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
            {licenses.map((license) => (
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
                  <div className={`${license.status === 1 ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                    {formatDate(license.expiresAt)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/edit-license/${license.id}`}
                      className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      onClick={() => onDelete(license.id)}
                      className="p-1.5 rounded bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
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
    </div>
  );
}

LicensesTable.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      assignedTo: PropTypes.string,
      assignedToName: PropTypes.string,
      assignedToEmail: PropTypes.string,
      devicesCount: PropTypes.number,
      status: PropTypes.number.isRequired,
      createdAt: PropTypes.string,
      expiresAt: PropTypes.string,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default LicensesTable;