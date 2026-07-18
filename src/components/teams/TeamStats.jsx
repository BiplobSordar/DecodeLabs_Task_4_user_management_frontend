import React, { useState, useEffect } from 'react';
import { Briefcase, Users, UserCheck, TrendingUp, Activity } from 'lucide-react';
import { teamService } from '../../services/team.service';

const TeamStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await teamService.getTeamStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch team stats:', error);
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
      title: 'Total Teams',
      value: stats.total_teams || 0,
      icon: Briefcase,
      color: 'bg-accent-bg border-accent-border text-accent'
    },
    {
      title: 'Active Teams',
      value: stats.active_teams || 0,
      icon: UserCheck,
      color: 'bg-success/10 border-success/20 text-success'
    },
    {
      title: 'Inactive Teams',
      value: stats.inactive_teams || 0,
      icon: Users,
      color: 'bg-danger/10 border-danger/20 text-danger'
    },
    {
      title: 'Avg Members',
      value: stats.avg_members ? Math.round(stats.avg_members) : 0,
      icon: TrendingUp,
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

export default TeamStats;