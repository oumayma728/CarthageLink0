import { Wrench } from "lucide-react";
import PropTypes from 'prop-types';

const statusStyles = {
  Active: {
    bg: "bg-green-100 dark:bg-green-900/50",
    text: "text-green-600 dark:text-green-400",
    hover: "hover:bg-green-200 dark:hover:bg-green-800",
    icon: null
  },
  Inactive: {
    bg: "bg-red-100 dark:bg-red-900/50",
    text: "text-red-600 dark:text-red-400",
    hover: "hover:bg-red-200 dark:hover:bg-red-800",
    icon: null
  },
  Maintenance: {
    bg: "bg-yellow-100 dark:bg-yellow-900/50",
    text: "text-yellow-600 dark:text-yellow-400",
    hover: "hover:bg-yellow-200 dark:hover:bg-yellow-800",
    icon: <Wrench className="w-3 h-3 mr-1" />
  }
};

export default function DeviceStatusButton({ status, isUpdating, onClick }) {
  const styles = statusStyles[status] || {
    bg: "bg-gray-100 dark:bg-gray-700",
    text: "text-gray-600 dark:text-gray-300",
    hover: "hover:bg-gray-200 dark:hover:bg-gray-600",
    icon: null
  };

  return (
    <button
      onClick={onClick}
      disabled={isUpdating}
      className={`text-xs px-2 py-1 rounded flex items-center ${
        isUpdating ? "cursor-wait opacity-70" : "cursor-pointer"
      } ${styles.bg} ${styles.text} ${styles.hover}`}
      aria-label={`Device status: ${status}. Click to change.`}
      aria-busy={isUpdating}
    >
      {styles.icon}
      {isUpdating ? "Updating..." : status}
    </button>
  );
}

DeviceStatusButton.propTypes = {
  status: PropTypes.oneOf(["Active", "Inactive", "Maintenance"]).isRequired,
  isUpdating: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

DeviceStatusButton.defaultProps = {
  isUpdating: false
};