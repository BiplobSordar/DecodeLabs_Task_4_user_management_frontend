import api from '../api/axios';

export const userService = {
  // Get all users with pagination
  getUsers: async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/users', {
      params: { page, limit, search }
    });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  //  Get current user profile
  getUserProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  //  Update current user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id, permanent = false) => {
    const response = await api.delete(`/users/${id}`, {
      params: { permanent }
    });
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id, isActive) => {
    const response = await api.patch(`/users/${id}/status`, { is_active: isActive });
    return response.data;
  },

  // Assign role to user
  assignRole: async (id, roleId) => {
    const response = await api.patch(`/users/${id}/role`, { role_id: roleId });
    return response.data;
  },

  // Get all roles
  getRoles: async () => {
    const response = await api.get('/users/roles');
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Bulk assign roles
  bulkAssignRole: async (userIds, roleId) => {
    const response = await api.post('/users/bulk/role', {
      user_ids: userIds,
      role_id: roleId
    });
    return response.data;
  }
};