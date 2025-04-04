import PropTypes from 'prop-types';
//import { Cpu, Factory, Users, Server } from "lucide-react";

function ActivityFeed({ activities }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 group">
            <div className="mt-1 mr-3 group-hover:scale-110 transition-transform">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                {activity.action}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activity.location}
              </p>
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ActivityFeed.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ).isRequired,
};

export default ActivityFeed;