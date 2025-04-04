import PropTypes from 'prop-types';

export default function StatusBadge({ status }) {
  const getStatusText = (status) => {
    return {
      0: "Active",
      1: "Expired",
      2: "Suspended",
      3: "Pending"
    }[status] || "Pending";
  };

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
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf([0, 1, 2, 3]).isRequired
};