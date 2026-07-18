import React from 'react';
import { Clock, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';

const TaskStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'badge-gray',
      icon: Clock
    },
    in_progress: {
      label: 'In Progress',
      color: 'badge-warning',
      icon: Loader2
    },
    completed: {
      label: 'Completed',
      color: 'badge-success',
      icon: CheckCircle
    },
    cancelled: {
      label: 'Cancelled',
      color: 'badge-danger',
      icon: XCircle
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`badge ${config.color} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export default TaskStatusBadge;