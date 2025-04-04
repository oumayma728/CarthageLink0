import PropTypes from 'prop-types';
import { Cpu, Factory, Users, Key } from "lucide-react";

const iconComponents = {
  Cpu,
  Factory,
  Users,
  Key
};

export default function StatCard({ title, value, icon }) {
  const Icon = iconComponents[icon];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-800 dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.oneOf(['Cpu', 'Factory', 'Users', 'Key']).isRequired
};