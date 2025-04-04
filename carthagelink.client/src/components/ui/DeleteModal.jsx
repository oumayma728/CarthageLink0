import PropTypes from 'prop-types';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
        <h3 className="font-medium mb-3">Delete Factory</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete this item?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Prop type validation
DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};