import React from 'react';
import { Flag, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

const TaskPriorityBadge = ({ priority }) => {
  const priorityConfig = {
    low: {
      label: 'Low',
      color: 'badge-gray',
      icon: Flag
    },
    medium: {
      label: 'Medium',
      color: 'badge-info',
      icon: AlertTriangle
    },
    high: {
      label: 'High',
      color: 'badge-warning',
      icon: AlertCircle
    },
    critical: {
      label: 'Critical',
      color: 'badge-danger',
      icon: AlertOctagon
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;
  const Icon = config.icon;

  return (
    <span className={`badge ${config.color} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export default TaskPriorityBadge;