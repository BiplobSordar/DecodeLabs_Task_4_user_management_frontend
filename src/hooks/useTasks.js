import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/task.service';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    team_id: null,
    assigned_to: null,
    due_date_from: '',
    due_date_to: ''
  });

  // Fetch all tasks with filters (Admin/Manager only)
  const fetchTasks = useCallback(async (page = 1, limit = 10, filterParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks(page, limit, filterParams);
      setTasks(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      toast.error('Failed to load tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch my tasks (assigned to current user)
  const fetchMyTasks = useCallback(async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getMyTasks(page, limit);
      setTasks(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch your tasks');
      toast.error('Failed to load your tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks by team
  const fetchTasksByTeam = useCallback(async (teamId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasksByTeam(teamId, page, limit);
      setTasks(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch team tasks');
      toast.error('Failed to load team tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks by user
  const fetchTasksByUser = useCallback(async (userId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasksByUser(userId, page, limit);
      setTasks(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch user tasks');
      toast.error('Failed to load user tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get task by ID
  const getTaskById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await taskService.getTaskById(id);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to load task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create task
  const createTask = useCallback(async (taskData) => {
    setLoading(true);
    try {
      // Ensure proper data types
      const data = {
        ...taskData,
        team_id: taskData.team_id ? parseInt(taskData.team_id) : null,
        assigned_to: taskData.assigned_to ? parseInt(taskData.assigned_to) : null,
      };
      
      const response = await taskService.createTask(data);
      toast.success('Task created successfully');
      // Refresh the current view
      await fetchTasks(pagination.page, pagination.limit, filters);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks, pagination.page, pagination.limit, filters]);

  // Update task
  const updateTask = useCallback(async (id, taskData) => {
    setLoading(true);
    try {
      // Ensure proper data types
      const data = {
        ...taskData,
        team_id: taskData.team_id ? parseInt(taskData.team_id) : null,
        assigned_to: taskData.assigned_to ? parseInt(taskData.assigned_to) : null,
      };
      
      const response = await taskService.updateTask(id, data);
      toast.success('Task updated successfully');
      await fetchTasks(pagination.page, pagination.limit, filters);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks, pagination.page, pagination.limit, filters]);

  // Update task status
  const updateTaskStatus = useCallback(async (id, status) => {
    setLoading(true);
    try {
      const response = await taskService.updateTaskStatus(id, status);
      toast.success(`Task ${status} successfully`);
      await fetchTasks(pagination.page, pagination.limit, filters);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to update task status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks, pagination.page, pagination.limit, filters]);

  // Assign task to user
  const assignTask = useCallback(async (id, userId) => {
    setLoading(true);
    try {
      const response = await taskService.assignTask(id, parseInt(userId));
      toast.success('Task assigned successfully');
      await fetchTasks(pagination.page, pagination.limit, filters);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to assign task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks, pagination.page, pagination.limit, filters]);

  // Delete task
  const deleteTask = useCallback(async (id, permanent = false) => {
    setLoading(true);
    try {
      await taskService.deleteTask(id, permanent);
      toast.success(permanent ? 'Task permanently deleted' : 'Task cancelled');
      await fetchTasks(pagination.page, pagination.limit, filters);
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks, pagination.page, pagination.limit, filters]);

  // Apply filters
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchTasks(1, pagination.limit, { ...filters, ...newFilters });
  }, [fetchTasks, pagination.limit, filters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const emptyFilters = {
      search: '',
      status: '',
      priority: '',
      team_id: null,
      assigned_to: null,
      due_date_from: '',
      due_date_to: ''
    };
    setFilters(emptyFilters);
    fetchTasks(1, pagination.limit, emptyFilters);
  }, [fetchTasks, pagination.limit]);

  // Get task statistics
  const getTaskStats = useCallback(async (teamId = null) => {
    try {
      const response = await taskService.getTaskStats(teamId);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to fetch task statistics');
      throw err;
    }
  }, []);

  // Get team task distribution
  const getTeamTaskDistribution = useCallback(async () => {
    try {
      const response = await taskService.getTeamTaskDistribution();
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to fetch team distribution');
      throw err;
    }
  }, []);

  // Get task count by status
  const getTaskCountByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status).length;
  }, [tasks]);

  // Get task count by priority
  const getTaskCountByPriority = useCallback((priority) => {
    return tasks.filter(task => task.priority === priority).length;
  }, [tasks]);

  // Get tasks assigned to current user
  const getMyTaskCount = useCallback(() => {
    return tasks.length;
  }, [tasks]);

  // Refresh current view
  const refresh = useCallback(async () => {
    await fetchTasks(pagination.page, pagination.limit, filters);
  }, [fetchTasks, pagination.page, pagination.limit, filters]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    // State
    tasks,
    loading,
    error,
    pagination,
    filters,
    
    // Fetch functions
    fetchTasks,
    fetchMyTasks,
    fetchTasksByTeam,
    fetchTasksByUser,
    getTaskById,
    
    // CRUD operations
    createTask,
    updateTask,
    updateTaskStatus,
    assignTask,
    deleteTask,
    
    // Filter functions
    applyFilters,
    clearFilters,
    setFilters,
    
    // Stats functions
    getTaskStats,
    getTeamTaskDistribution,
    getTaskCountByStatus,
    getTaskCountByPriority,
    getMyTaskCount,
    
    // Utility
    refresh
  };
};