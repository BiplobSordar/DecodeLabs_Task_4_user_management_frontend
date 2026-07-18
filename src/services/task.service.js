import api from '../api/axios';

export const taskService = {
  // Get all tasks with filters
  getTasks: async (page = 1, limit = 10, filters = {}) => {
    const response = await api.get('/tasks', {
      params: { page, limit, ...filters }
    });
    return response.data;
  },

  // Get my tasks (assigned to current user)
  getMyTasks: async (page = 1, limit = 10) => {
    const response = await api.get('/tasks/my-tasks', {
      params: { page, limit }
    });
    return response.data;
  },

  // Get tasks by team
  getTasksByTeam: async (teamId, page = 1, limit = 10) => {
    const response = await api.get(`/tasks/team/${teamId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get tasks by user
  getTasksByUser: async (userId, page = 1, limit = 10) => {
    const response = await api.get(`/tasks/user/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Assign task
  assignTask: async (id, userId) => {
    const response = await api.patch(`/tasks/${id}/assign`, { user_id: userId });
    return response.data;
  },

  // Delete task
  deleteTask: async (id, permanent = false) => {
    const response = await api.delete(`/tasks/${id}`, {
      params: { permanent }
    });
    return response.data;
  },

  // Get task statistics
  getTaskStats: async (teamId = null) => {
    const response = await api.get('/tasks/stats', {
      params: { team_id: teamId }
    });
    return response.data;
  },

  // Get team task distribution
  getTeamTaskDistribution: async () => {
    const response = await api.get('/tasks/team-distribution');
    return response.data;
  }
};