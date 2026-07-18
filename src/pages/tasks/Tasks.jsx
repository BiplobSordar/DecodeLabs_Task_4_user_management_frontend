import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/team.service';
import { userService } from '../../services/user.service';
import TaskStats from '../../components/tasks/TaskStats';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ClipboardList,
  UserCheck,
  Calendar,
  AlertCircle,
  X,
  User,
  Briefcase,
  Star,
  CheckCircle,
  Users,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user } = useAuth();
  const {
    tasks: allTasks,
    loading,
    pagination,
    filters,
    fetchTasks,
    fetchMyTasks,
    updateTaskStatus,
    deleteTask,
    applyFilters,
    clearFilters,
    setFilters
  } = useTasks();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('my');
  const [expandedTask, setExpandedTask] = useState(null);
  
  // Task grouping states
  const [myTasksData, setMyTasksData] = useState([]);
  const [myTasksPagination, setMyTasksPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [userTeamIds, setUserTeamIds] = useState([]);
  
  // Current displayed tasks based on view mode
  const currentTasks = viewMode === 'my' ? myTasksData : allTasks;
  const currentPagination = viewMode === 'my' ? myTasksPagination : pagination;

  const canCreate = user?.permissions?.includes('create_task');
  const canEdit = user?.permissions?.includes('update_task');
  const canDelete = user?.permissions?.includes('delete_task');
  const canViewAll = user?.permissions?.includes('view_tasks');
  const isAdminOrManager = user?.role_name === 'admin' || user?.role_name === 'manager';

  useEffect(() => {
    fetchTeamsAndUsers();
    fetchUserTeams();
    loadMyTasks();
    setViewMode('my');
  }, []);

  const fetchUserTeams = async () => {
    try {
      const response = await teamService.getMyTeams();
      const teamIds = response.data?.map(team => team.id) || [];
      setUserTeamIds(teamIds);
    } catch (error) {
      console.error('Failed to fetch user teams:', error);
    }
  };

  const fetchTeamsAndUsers = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        teamService.getTeams(1, 100),
        userService.getUsers(1, 100)
      ]);
      setTeams(teamsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch teams and users:', error);
    }
  };

  const loadMyTasks = async (page = 1, limit = 10, search = '') => {
    try {
      const response = await fetchMyTasks(page, limit, search);
      setMyTasksData(response || []);
      if (response && response.pagination) {
        setMyTasksPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to load my tasks:', error);
    }
  };

  const loadAllTasks = async (page = 1, limit = 10, filterParams = {}) => {
    await fetchTasks(page, limit, filterParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (viewMode === 'my') {
      loadMyTasks(1, 10, filters.search);
    } else {
      applyFilters({ search: filters.search });
    }
  };

  const handlePageChange = (newPage) => {
    if (viewMode === 'my') {
      loadMyTasks(newPage, 10, filters.search);
    } else {
      fetchTasks(newPage, 10, filters);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    const task = currentTasks.find(t => t.id === taskId);
    if (!task) {
      toast.error('Task not found');
      return;
    }

    const isAssignedToMe = task.assigned_to_id === user?.id;
    const canChangeStatus = isAssignedToMe || isAdminOrManager;

    if (!canChangeStatus) {
      toast.error('You can only change status of tasks assigned to you');
      return;
    }

    if (task.status === 'completed') {
      toast.error('Cannot change status of completed task');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTaskStatus(taskId, status);
      toast.success(`Task status updated to ${status}`);
      
      if (viewMode === 'my') {
        await loadMyTasks(myTasksPagination.page, 10, filters.search);
      } else {
        await fetchTasks(pagination.page, 10, filters);
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error(error.message || 'Failed to update task status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    
    if (!isAdminOrManager) {
      toast.error('You do not have permission to delete tasks');
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteTask(selectedTask.id, true);
      toast.success('Task deleted successfully');
      setShowDeleteModal(false);
      setSelectedTask(null);
      
      if (viewMode === 'my') {
        await loadMyTasks(myTasksPagination.page, 10, filters.search);
      } else {
        await fetchTasks(pagination.page, 10, filters);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error(error.message || 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    if (viewMode === 'my') {
      loadMyTasks(1, 10, filters);
    } else {
      applyFilters(filters);
    }
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    clearFilters();
    setShowFilters(false);
    if (viewMode === 'my') {
      loadMyTasks(1, 10);
    }
  };

  const handleViewModeChange = async (mode) => {
    setViewMode(mode);
    clearFilters();
    if (mode === 'my') {
      await loadMyTasks(1, 10);
    } else {
      await loadAllTasks(1, 10);
    }
  };

  const toggleTaskExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const getGroupedTasks = () => {
    const my = allTasks.filter(task => task.assigned_to_id === user?.id);
    const team = allTasks.filter(task => 
      task.assigned_to_id !== user?.id && 
      userTeamIds.includes(task.team_id)
    );
    const other = allTasks.filter(task => 
      task.assigned_to_id !== user?.id && 
      !userTeamIds.includes(task.team_id)
    );
    return { my, team, other };
  };

  const groupedTasks = getGroupedTasks();

  const canChangeTaskStatus = (task) => {
    if (!task) return false;
    const isAssignedToMe = task.assigned_to_id === user?.id;
    return isAssignedToMe || isAdminOrManager;
  };

  const canEditTask = (task) => {
    if (!task) return false;
    if (isAdminOrManager) return true;
    return task.assigned_to_id === user?.id;
  };

  // Render mobile task card
  const renderMobileTaskCard = (task, type) => {
    const isMyTask = type === 'my';
    const isTeamTask = type === 'team';
    const canChangeStatus = canChangeTaskStatus(task);
    const canEditTaskPermission = canEditTask(task);
    const isCompleted = task.status === 'completed';
    const isExpanded = expandedTask === task.id;

    return (
      <div 
        key={task.id} 
        className={`rounded-lg border p-4 mb-3 transition ${
          isMyTask 
            ? 'bg-accent-bg/30 border-accent-border/30' 
            : isTeamTask
              ? 'bg-blue-50/30 border-blue-200/30 dark:bg-blue-900/10 dark:border-blue-800/30'
              : 'bg-surface border-border'
        }`}
      >
        {/* Task Header - Always visible */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-text-h truncate">
                {task.title}
              </p>
              {isMyTask && (
                <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                  <CheckCircle className="w-3 h-3" />
                  Mine
                </span>
              )}
              {isTeamTask && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full dark:text-blue-400 dark:bg-blue-900/30 whitespace-nowrap">
                  <Users className="w-3 h-3" />
                  Team
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted mt-1">
              <span>{task.team_name || 'No Team'}</span>
              <span className="w-1 h-1 rounded-full bg-muted"></span>
              <span>{task.assigned_to_name || 'Unassigned'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Status on mobile - simplified */}
            {canChangeStatus && !isCompleted ? (
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className="text-xs border rounded-lg px-2 py-1 bg-transparent focus:ring-1 focus:ring-accent cursor-pointer max-w-[100px]"
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              <TaskStatusBadge status={task.status} />
            )}
            <button
              onClick={() => toggleTaskExpand(task.id)}
              className="p-1 rounded-lg hover:bg-accent-bg text-muted transition"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-3">
            {/* Description */}
            {task.description && (
              <p className="text-sm text-muted line-clamp-2">{task.description}</p>
            )}
            
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted">Priority:</span>
                <div className="mt-1">
                  <TaskPriorityBadge priority={task.priority} />
                </div>
              </div>
              <div>
                <span className="text-muted">Due Date:</span>
                <p className="text-text-h font-medium">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                </p>
              </div>
              <div>
                <span className="text-muted">Team:</span>
                <p className="text-text-h font-medium truncate">{task.team_name || 'No Team'}</p>
              </div>
              <div>
                <span className="text-muted">Assigned To:</span>
                <p className="text-text-h font-medium truncate">{task.assigned_to_name || 'Unassigned'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Link
                to={`/tasks/${task.id}`}
                className="btn-secondary text-xs py-1 px-3 flex-1 flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View
              </Link>
              {canEditTaskPermission && (
                <Link
                  to={`/tasks/${task.id}/edit`}
                  className="btn-secondary text-xs py-1 px-3 flex-1 flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Link>
              )}
              {canDelete && isAdminOrManager && task.status !== 'completed' && (
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowDeleteModal(true);
                  }}
                  className="btn-danger text-xs py-1 px-3 flex-1 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render desktop task row
  const renderDesktopTaskRow = (task, type) => {
    const isMyTask = type === 'my';
    const isTeamTask = type === 'team';
    const canChangeStatus = canChangeTaskStatus(task);
    const canEditTaskPermission = canEditTask(task);
    const isCompleted = task.status === 'completed';

    return (
      <div 
        key={task.id} 
        className={`flex items-center justify-between p-3 rounded-lg border transition ${
          isMyTask 
            ? 'bg-accent-bg/30 border-accent-border/30 hover:border-accent-border' 
            : isTeamTask
              ? 'bg-blue-50/30 border-blue-200/30 hover:border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/30'
              : 'bg-surface border-border hover:border-accent-border/50'
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text-h truncate">
              {task.title}
            </p>
            {isMyTask && (
              <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                <CheckCircle className="w-3 h-3" />
                Mine
              </span>
            )}
            {isTeamTask && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full dark:text-blue-400 dark:bg-blue-900/30 whitespace-nowrap">
                <Users className="w-3 h-3" />
                Team
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted mt-1">
            <span>{task.team_name || 'No Team'}</span>
            <span className="w-1 h-1 rounded-full bg-muted"></span>
            <span>{task.assigned_to_name || 'Unassigned'}</span>
            {task.due_date && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted"></span>
                <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
              </>
            )}
            <span className="w-1 h-1 rounded-full bg-muted"></span>
            <TaskPriorityBadge priority={task.priority} />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {canChangeStatus && !isCompleted ? (
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
              className="text-xs border rounded-lg px-2 py-1 bg-transparent focus:ring-1 focus:ring-accent cursor-pointer"
              disabled={isSubmitting}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          ) : (
            <TaskStatusBadge status={task.status} />
          )}
          <div className="flex items-center gap-1">
            <Link
              to={`/tasks/${task.id}`}
              className="p-1.5 rounded-lg hover:bg-accent-bg text-muted hover:text-accent transition"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Link>
            {canEditTaskPermission && (
              <Link
                to={`/tasks/${task.id}/edit`}
                className="p-1.5 rounded-lg hover:bg-accent-bg text-muted hover:text-accent transition"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Link>
            )}
            {canDelete && isAdminOrManager && task.status !== 'completed' && (
              <button
                onClick={() => {
                  setSelectedTask(task);
                  setShowDeleteModal(true);
                }}
                className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render section
  const renderSection = (title, tasks, icon, type) => {
    if (!tasks || tasks.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h2 className="text-lg font-semibold text-text-h">{title}</h2>
          <span className="text-sm text-muted">({tasks.length})</span>
        </div>
        <div className="space-y-2">
          {/* Desktop view - hidden on mobile */}
          <div className="hidden md:block">
            {tasks.map((task) => renderDesktopTaskRow(task, type))}
          </div>
          {/* Mobile view - visible on mobile */}
          <div className="md:hidden">
            {tasks.map((task) => renderMobileTaskCard(task, type))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Tasks</h1>
          <p className="text-muted text-sm">Manage and track your tasks</p>
        </div>
        {canCreate && (
          <Link to="/tasks/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Link>
        )}
      </div>

      {/* Task Stats - Responsive */}
      <TaskStats />

      {/* View Mode Toggle - Responsive */}
      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => handleViewModeChange('my')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                viewMode === 'my'
                  ? 'bg-accent text-white'
                  : 'bg-accent-bg/50 text-muted hover:bg-accent-bg'
              }`}
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              My Tasks
              <span className={`ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                viewMode === 'my' ? 'bg-white/20 text-white' : 'bg-accent-bg text-accent'
              }`}>
                {myTasksData.length}
              </span>
            </button>
            {canViewAll && (
              <button
                onClick={() => handleViewModeChange('all')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                  viewMode === 'all'
                    ? 'bg-accent text-white'
                    : 'bg-accent-bg/50 text-muted hover:bg-accent-bg'
                }`}
              >
                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                All Tasks
                <span className={`ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                  viewMode === 'all' ? 'bg-white/20 text-white' : 'bg-accent-bg text-accent'
                }`}>
                  {allTasks.length}
                </span>
              </button>
            )}
          </div>
          <div className="text-[10px] sm:text-xs text-muted">
            {viewMode === 'my' 
              ? 'Showing tasks assigned to you' 
              : 'Showing all tasks (yours first, then team, then others)'}
          </div>
        </div>
      </div>

      {/* Search and Filters - Responsive */}
      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted" />
              </div>
              <input
                type="text"
                placeholder={viewMode === 'my' ? "Search your tasks..." : "Search all tasks..."}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-base pl-9 sm:pl-10 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary px-3 sm:px-4 whitespace-nowrap text-sm">
              Search
            </button>
          </form>
          {viewMode === 'all' && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary px-3 sm:px-4 whitespace-nowrap text-sm flex items-center gap-1 sm:gap-2"
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Filters</span>
                {Object.values(filters).some(v => v && v !== '') && (
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent"></span>
                )}
              </button>
              {Object.values(filters).some(v => v && v !== '') && (
                <button
                  onClick={handleClearFilters}
                  className="btn-secondary px-3 sm:px-4 whitespace-nowrap text-sm flex items-center gap-1 sm:gap-2"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Clear</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filter Panel - Responsive */}
        {showFilters && viewMode === 'all' && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-h mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-base text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-h mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="input-base text-sm"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-h mb-1">Team</label>
              <select
                value={filters.team_id || ''}
                onChange={(e) => handleFilterChange('team_id', e.target.value ? parseInt(e.target.value) : null)}
                className="input-base text-sm"
              >
                <option value="">All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-h mb-1">Assigned To</label>
              <select
                value={filters.assigned_to || ''}
                onChange={(e) => handleFilterChange('assigned_to', e.target.value ? parseInt(e.target.value) : null)}
                className="input-base text-sm"
              >
                <option value="">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2">
              <button onClick={handleClearFilters} className="btn-secondary text-sm">
                Clear All
              </button>
              <button onClick={handleApplyFilters} className="btn-primary text-sm">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : currentTasks.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center">
          <ClipboardList className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted/30 mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-text-h">
            {viewMode === 'my' ? 'No tasks assigned to you' : 'No tasks found'}
          </h3>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {viewMode === 'my' 
              ? 'You have no tasks assigned yet. Check back later or ask your manager.'
              : filters.search || filters.status || filters.priority 
                ? 'Try adjusting your filters' 
                : 'Create your first task to get started'
            }
          </p>
          {canCreate && (
            <Link to="/tasks/new" className="btn-primary mt-4 inline-flex text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Link>
          )}
        </div>
      ) : (
        <div className="card p-3 sm:p-4">
          {viewMode === 'all' ? (
            <>
              {renderSection('My Tasks', groupedTasks.my, <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />, 'my')}
              {renderSection('Team Tasks', groupedTasks.team, <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />, 'team')}
              {renderSection('Other Tasks', groupedTasks.other, <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />, 'other')}
            </>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <h2 className="text-base sm:text-lg font-semibold text-text-h">My Tasks</h2>
                <span className="text-sm text-muted">({currentTasks.length})</span>
              </div>
              <div className="space-y-2">
                {/* Desktop view */}
                <div className="hidden md:block">
                  {currentTasks.map((task) => renderDesktopTaskRow(task, 'my'))}
                </div>
                {/* Mobile view */}
                <div className="md:hidden">
                  {currentTasks.map((task) => renderMobileTaskCard(task, 'my'))}
                </div>
              </div>
            </div>
          )}

          {/* Pagination - Responsive */}
          {currentPagination.totalPages > 1 && (
            <div className="flex flex-col xs:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-border">
              <p className="text-[10px] sm:text-xs text-muted">
                Showing {((currentPagination.page - 1) * currentPagination.limit) + 1} to{' '}
                {Math.min(currentPagination.page * currentPagination.limit, currentPagination.total)} of{' '}
                {currentPagination.total} tasks
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPagination.page - 1)}
                  disabled={currentPagination.page === 1}
                  className="p-1.5 sm:p-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-bg transition"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="text-[10px] sm:text-sm text-muted">
                  Page {currentPagination.page} of {currentPagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPagination.page + 1)}
                  disabled={currentPagination.page === currentPagination.totalPages}
                  className="p-1.5 sm:p-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-bg transition"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal - Responsive */}
      {showDeleteModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-4 sm:p-6 shadow-lg border border-border animate-enter">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-danger" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-text-h">Delete Task</h3>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  Are you sure you want to delete <strong>"{selectedTask.title}"</strong>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTask(null);
                }}
                className="btn-secondary text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete Task'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;