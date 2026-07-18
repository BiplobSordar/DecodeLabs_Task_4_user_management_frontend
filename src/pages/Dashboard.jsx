// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import api from '../api/axios';
// import { Link } from 'react-router-dom';
// import { 
//   Users, 
//   Briefcase, 
//   ClipboardList, 
//   CheckCircle,
//   TrendingUp,
//   Clock,
//   ArrowRight,
//   Loader2,
//   Calendar,
//   Activity,
//   UserCheck,
//   BarChart3
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalTeams: 0,
//     totalTasks: 0,
//     completedTasks: 0,
//     pendingTasks: 0,
//     inProgressTasks: 0,
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [recentTasks, setRecentTasks] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch stats
//       const statsResponse = await api.get('/dashboard/stats');
//       console.log('Stats Response:', statsResponse.data);
      
//       // Map API response to stats state
//       if (statsResponse.data.success && statsResponse.data.data) {
//         const data = statsResponse.data.data;
//         setStats({
//           totalUsers: data.total_users || 0,
//           totalTeams: data.total_teams || 0,
//           totalTasks: data.total_tasks || 0,
//           completedTasks: data.completed_tasks || 0,
//           pendingTasks: data.pending_tasks || 0,
//           inProgressTasks: data.in_progress_tasks || 0,
//         });
//       }

//       // Fetch recent tasks
//       const tasksResponse = await api.get('/dashboard/recent-tasks');
//       console.log('Recent Tasks Response:', tasksResponse.data);
      
//       if (tasksResponse.data.success && tasksResponse.data.data) {
//         setRecentTasks(tasksResponse.data.data);
//       }

//       // Fetch recent activity (optional - if endpoint exists)
//       try {
//         const activityResponse = await api.get('/dashboard/recent-activity');
//         if (activityResponse.data.success && activityResponse.data.data) {
//           setRecentActivity(activityResponse.data.data);
//         }
//       } catch (activityError) {
//         console.log('Recent activity endpoint not available yet');
//         // Set some default activity if needed
//         setRecentActivity([]);
//       }
      
//     } catch (error) {
//       console.error('Failed to fetch dashboard data:', error);
//       toast.error('Failed to load dashboard data');
      
//       // Set fallback data if API fails
//       setStats({
//         totalUsers: 0,
//         totalTeams: 0,
//         totalTasks: 0,
//         completedTasks: 0,
//         pendingTasks: 0,
//         inProgressTasks: 0,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Stat Cards Configuration with actual data
//   const statCards = [
//     { 
//       title: 'Total Users', 
//       value: stats.totalUsers, 
//       icon: Users,
//       color: 'bg-accent-bg border-accent-border text-accent'
//     },
//     { 
//       title: 'Total Teams', 
//       value: stats.totalTeams, 
//       icon: Briefcase,
//       color: 'bg-purple-100 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400'
//     },
//     { 
//       title: 'Total Tasks', 
//       value: stats.totalTasks, 
//       icon: ClipboardList,
//       color: 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
//     },
//     { 
//       title: 'Completed Tasks', 
//       value: stats.completedTasks, 
//       icon: CheckCircle,
//       color: 'bg-success/10 border-success/20 text-success'
//     },
//   ];

//   // Additional stats for the second row
//   const additionalStats = [
//     {
//       title: 'Pending Tasks',
//       value: stats.pendingTasks,
//       icon: Clock,
//       color: 'bg-warning/10 border-warning/20 text-warning'
//     },
//     {
//       title: 'In Progress',
//       value: stats.inProgressTasks,
//       icon: Activity,
//       color: 'bg-accent/10 border-accent/20 text-accent'
//     },
//     {
//       title: 'Active Users',
//       value: stats.totalUsers > 0 ? Math.round(stats.totalUsers * 0.8) : 0,
//       icon: UserCheck,
//       color: 'bg-success/10 border-success/20 text-success'
//     }
//   ];

//   // Task Status Badge Component
//   const TaskStatusBadge = ({ status }) => {
//     const statusConfig = {
//       completed: { color: 'badge-success', label: 'Completed' },
//       in_progress: { color: 'badge-warning', label: 'In Progress' },
//       pending: { color: 'badge-gray', label: 'Pending' },
//       cancelled: { color: 'badge-danger', label: 'Cancelled' }
//     };

//     const config = statusConfig[status] || statusConfig.pending;
//     return (
//       <span className={`badge ${config.color}`}>
//         {config.label}
//       </span>
//     );
//   };

//   // Format date helper
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Format time helper
//   const formatTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   // Loading State
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 gap-4">
//         <Loader2 className="w-10 h-10 animate-spin text-accent" />
//         <p className="text-muted">Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="card p-6 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
//         <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
//         <div className="relative z-10">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-text-h">
//                 Welcome back, {user?.first_name || 'User'}! 👋
//               </h1>
//               <p className="text-muted mt-1">
//                 Here's what's happening with your projects today.
//               </p>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-muted">
//               <Calendar className="w-4 h-4" />
//               <span>{new Date().toLocaleDateString('en-US', { 
//                 weekday: 'long', 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//               })}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid - Main */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {statCards.map((stat, index) => (
//           <div key={index} className="card p-4 lg:p-6 hover:card-hover transition">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0">
//                 <p className="text-xs font-medium text-muted uppercase tracking-wider truncate">
//                   {stat.title}
//                 </p>
//                 <p className="text-2xl font-bold text-text-h mt-1">
//                   {stat.value}
//                 </p>
//               </div>
//               <div className={`w-10 h-10 rounded-full ${stat.color} border-2 flex items-center justify-center flex-shrink-0`}>
//                 <stat.icon className="w-5 h-5" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Additional Stats Row */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {additionalStats.map((stat, index) => (
//           <div key={index} className="card p-4 flex items-center gap-4 hover:card-hover transition">
//             <div className={`w-10 h-10 rounded-full ${stat.color} border-2 flex items-center justify-center flex-shrink-0`}>
//               <stat.icon className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-xs font-medium text-muted uppercase tracking-wider">{stat.title}</p>
//               <p className="text-xl font-bold text-text-h">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Tasks & Activity Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Tasks */}
//         <div className="card p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-text-h flex items-center gap-2">
//               <ClipboardList className="w-5 h-5 text-accent" />
//               Recent Tasks
//             </h3>
//             <Link 
//               to="/tasks" 
//               className="text-sm text-accent hover:text-primary-dark font-medium flex items-center gap-1 transition"
//             >
//               View All
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>
          
//           <div className="space-y-3">
//             {recentTasks.length > 0 ? (
//               recentTasks.slice(0, 5).map((task) => (
//                 <div 
//                   key={task.id} 
//                   className="flex items-center justify-between p-3 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border transition"
//                 >
//                   <div className="min-w-0 flex-1">
//                     <p className="font-medium text-text-h text-sm truncate">{task.title}</p>
//                     <p className="text-xs text-muted flex items-center gap-2">
//                       <Briefcase className="w-3 h-3" />
//                       {task.team_name || 'No Team'}
//                       {task.due_date && (
//                         <>
//                           <span className="w-1 h-1 rounded-full bg-muted"></span>
//                           <span>Due: {formatDate(task.due_date)}</span>
//                         </>
//                       )}
//                     </p>
//                   </div>
//                   <TaskStatusBadge status={task.status} />
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <ClipboardList className="w-12 h-12 mx-auto text-muted/30 mb-2" />
//                 <p className="text-muted text-sm">No recent tasks</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="card p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-text-h flex items-center gap-2">
//               <Activity className="w-5 h-5 text-accent" />
//               Recent Activity
//             </h3>
//             <button className="text-sm text-accent hover:text-primary-dark font-medium flex items-center gap-1 transition">
//               View All
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           </div>
          
//           <div className="space-y-3">
//             {recentActivity.length > 0 ? (
//               recentActivity.slice(0, 5).map((activity, index) => (
//                 <div 
//                   key={index} 
//                   className="flex items-center gap-3 p-3 bg-accent-bg/30 rounded-lg border border-accent-border/20"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
//                     <div className="w-2 h-2 rounded-full bg-accent"></div>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-text-h">{activity.message || 'Activity'}</p>
//                     <p className="text-xs text-muted flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {activity.created_at ? formatTime(activity.created_at) : 'Just now'}
//                       {activity.user_name && (
//                         <>
//                           <span className="w-1 h-1 rounded-full bg-muted"></span>
//                           <span>by {activity.user_name}</span>
//                         </>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <Activity className="w-12 h-12 mx-auto text-muted/30 mb-2" />
//                 <p className="text-muted text-sm">No recent activity</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="card p-6">
//         <h3 className="text-lg font-semibold text-text-h mb-4 flex items-center gap-2">
//           <BarChart3 className="w-5 h-5 text-accent" />
//           Quick Actions
//         </h3>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           <Link 
//             to="/users/new" 
//             className="flex flex-col items-center justify-center p-4 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border hover:bg-accent-bg/50 transition"
//           >
//             <Users className="w-6 h-6 text-accent mb-2" />
//             <span className="text-sm font-medium text-text-h">Add User</span>
//           </Link>
//           <Link 
//             to="/teams/new" 
//             className="flex flex-col items-center justify-center p-4 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border hover:bg-accent-bg/50 transition"
//           >
//             <Briefcase className="w-6 h-6 text-accent mb-2" />
//             <span className="text-sm font-medium text-text-h">Create Team</span>
//           </Link>
//           <Link 
//             to="/tasks/new" 
//             className="flex flex-col items-center justify-center p-4 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border hover:bg-accent-bg/50 transition"
//           >
//             <ClipboardList className="w-6 h-6 text-accent mb-2" />
//             <span className="text-sm font-medium text-text-h">New Task</span>
//           </Link>
//           <Link 
//             to="/reports" 
//             className="flex flex-col items-center justify-center p-4 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border hover:bg-accent-bg/50 transition"
//           >
//             <BarChart3 className="w-6 h-6 text-accent mb-2" />
//             <span className="text-sm font-medium text-text-h">View Reports</span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  ClipboardList, 
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  Calendar,
  Activity,
  UserCheck,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch stats
      const statsResponse = await api.get('/dashboard/stats');
      
      if (statsResponse.data.success && statsResponse.data.data) {
        setStats(statsResponse.data.data);
      } else {
        setStats(null);
      }

      // Fetch recent tasks
      const tasksResponse = await api.get('/dashboard/recent-tasks');
      
      if (tasksResponse.data.success && tasksResponse.data.data) {
        setRecentTasks(tasksResponse.data.data);
      } else {
        setRecentTasks([]);
      }

      // Fetch recent activity
      try {
        const activityResponse = await api.get('/dashboard/recent-activity');
        if (activityResponse.data.success && activityResponse.data.data) {
          setRecentActivity(activityResponse.data.data);
        } else {
          setRecentActivity([]);
        }
      } catch (activityError) {
        // Activity endpoint might not exist yet
        setRecentActivity([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
      setStats(null);
      setRecentTasks([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  // Task Status Badge Component
  const TaskStatusBadge = ({ status }) => {
    const statusConfig = {
      completed: { color: 'badge-success', label: 'Completed' },
      in_progress: { color: 'badge-warning', label: 'In Progress' },
      pending: { color: 'badge-gray', label: 'Pending' },
      cancelled: { color: 'badge-danger', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`badge ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="text-muted">Loading dashboard...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="card p-12 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-danger mb-4" />
        <h3 className="text-lg font-semibold text-text-h">Failed to Load Dashboard</h3>
        <p className="text-muted text-sm mt-1">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="btn-primary mt-4 inline-flex"
        >
          Retry
        </button>
      </div>
    );
  }

  // No Data State
  if (!stats || stats.total_users === 0 && stats.total_teams === 0 && stats.total_tasks === 0) {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-text-h">
                  Welcome to your Dashboard, {user?.first_name || 'User'}! 
                </h1>
                <p className="text-muted mt-1">
                  Get started by creating your first team or task.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="card p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-text-h">No Data Yet</h3>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">
            Start building your project by adding users, creating teams, and assigning tasks.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link to="/users/new" className="btn-primary">
              <Users className="w-4 h-4 mr-2" />
              Add First User
            </Link>
            <Link to="/teams/new" className="btn-secondary">
              <Briefcase className="w-4 h-4 mr-2" />
              Create First Team
            </Link>
            <Link to="/tasks/new" className="btn-secondary">
              <ClipboardList className="w-4 h-4 mr-2" />
              Create First Task
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Prepare stat cards from real data
  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.total_users || 0, 
      icon: Users,
      color: 'bg-accent-bg border-accent-border text-accent'
    },
    { 
      title: 'Total Teams', 
      value: stats.total_teams || 0, 
      icon: Briefcase,
      color: 'bg-purple-100 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400'
    },
    { 
      title: 'Total Tasks', 
      value: stats.total_tasks || 0, 
      icon: ClipboardList,
      color: 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
    },
    { 
      title: 'Completed Tasks', 
      value: stats.completed_tasks || 0, 
      icon: CheckCircle,
      color: 'bg-success/10 border-success/20 text-success'
    },
  ];

  // Additional stats from real data
  const additionalStats = [
    {
      title: 'Pending Tasks',
      value: stats.pending_tasks || 0,
      icon: Clock,
      color: 'bg-warning/10 border-warning/20 text-warning'
    },
    {
      title: 'In Progress',
      value: stats.in_progress_tasks || 0,
      icon: Activity,
      color: 'bg-accent/10 border-accent/20 text-accent'
    },
    {
      title: 'Active Users',
      value: stats.active_users || 0,
      icon: UserCheck,
      color: 'bg-success/10 border-success/20 text-success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-h">
                Welcome back, {user?.first_name || 'User'}! 
              </h1>
              <p className="text-muted mt-1">
                Here's what's happening with your projects today.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Main */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-4 lg:p-6 hover:card-hover transition">
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

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {additionalStats.map((stat, index) => (
          <div key={index} className="card p-4 flex items-center gap-4 hover:card-hover transition">
            <div className={`w-10 h-10 rounded-full ${stat.color} border-2 flex items-center justify-center flex-shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">{stat.title}</p>
              <p className="text-xl font-bold text-text-h">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tasks & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-h flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-accent" />
              Recent Tasks
            </h3>
            <Link 
              to="/tasks" 
              className="text-sm text-accent hover:text-primary-dark font-medium flex items-center gap-1 transition"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-3 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-h text-sm truncate">{task.title}</p>
                    <p className="text-xs text-muted flex items-center gap-2">
                      <Briefcase className="w-3 h-3" />
                      {task.team_name || 'No Team'}
                      {task.due_date && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-muted"></span>
                          <span>Due: {formatDate(task.due_date)}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <TaskStatusBadge status={task.status} />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 mx-auto text-muted/30 mb-2" />
                <p className="text-muted text-sm">No recent tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-h flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Recent Activity
            </h3>
          </div>
          
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-accent-bg/30 rounded-lg border border-accent-border/20"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-h">{activity.message || 'Activity'}</p>
                    <p className="text-xs text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.created_at ? formatTime(activity.created_at) : 'Just now'}
                      {activity.user_name && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-muted"></span>
                          <span>by {activity.user_name}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto text-muted/30 mb-2" />
                <p className="text-muted text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-h mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link 
            to="/users/new" 
            className="flex flex-col items-center justify-center p-4 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border hover:bg-accent-bg/50 transition"
          >
            <Users className="w-6 h-6 text-accent mb-2" />
            <span className="text-sm font-medium text-text-h">Add User</span>
          </Link>
          <Link 
            to="/teams/new" 
            className="flex flex-col items-center justify-center p-4 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border hover:bg-accent-bg/50 transition"
          >
            <Briefcase className="w-6 h-6 text-accent mb-2" />
            <span className="text-sm font-medium text-text-h">Create Team</span>
          </Link>
          <Link 
            to="/tasks/new" 
            className="flex flex-col items-center justify-center p-4 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border hover:bg-accent-bg/50 transition"
          >
            <ClipboardList className="w-6 h-6 text-accent mb-2" />
            <span className="text-sm font-medium text-text-h">New Task</span>
          </Link>
          <Link 
            to="/reports" 
            className="flex flex-col items-center justify-center p-4 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border hover:bg-accent-bg/50 transition"
          >
            <BarChart3 className="w-6 h-6 text-accent mb-2" />
            <span className="text-sm font-medium text-text-h">View Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;