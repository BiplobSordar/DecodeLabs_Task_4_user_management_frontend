import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, TrendingUp, Calendar, Activity } from 'lucide-react';
import { userService } from '../../services/user.service';

const UserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await userService.getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 lg:p-6 animate-pulse">
            <div className="h-16 bg-border rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users,
      icon: Users,
      color: 'bg-accent-bg border-accent-border text-accent'
    },
    {
      title: 'Active Users',
      value: stats.active_users,
      icon: UserCheck,
      color: 'bg-success/10 border-success/20 text-success'
    },
    {
      title: 'Inactive Users',
      value: stats.inactive_users,
      icon: UserX,
      color: 'bg-danger/10 border-danger/20 text-danger'
    },
    {
      title: 'Active (30 days)',
      value: stats.active_last_30_days,
      icon: Activity,
      color: 'bg-warning/10 border-warning/20 text-warning'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="card p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted uppercase tracking-wider truncate">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-text-h mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full ${stat.color} border-2 flex items-center justify-center flex-shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;