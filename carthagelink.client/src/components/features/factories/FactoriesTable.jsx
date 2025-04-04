import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";

export default function FactoriesTable({ factories, isLoading, onDelete }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!factories || factories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No factories found</p>
        <Link 
          to="/factories/new" 
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Factory
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
            <th className="px-6 py-3 text-left">Location</th>
            <th className="px-6 py-3 text-left">Tax Number</th>
            <th className="px-6 py-3 text-left">License</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {factories.map((factory) => (
            <tr key={factory.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 whitespace-nowrap">{factory.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{factory.factoryEmail || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{factory.location || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{factory.taxNumber || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700">
                  {factory.licenseKey}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-2">
                  <Link
                    to={`/factories/edit/${factory.id}`}
                    className="p-1.5 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                  >
                    <Edit3 size={16} />
                  </Link>
                  <button
                    onClick={() => onDelete(factory.id)}
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

// Add prop type validation
FactoriesTable.propTypes = {
  factories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      factoryEmail: PropTypes.string,
      location: PropTypes.string,
      taxNumber: PropTypes.string,
      licenseKey: PropTypes.string
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired
};