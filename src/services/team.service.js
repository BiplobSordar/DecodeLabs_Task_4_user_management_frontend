import api from '../api/axios';

export const teamService = {
  // Get all teams with pagination
  getTeams: async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/teams', {
      params: { page, limit, search }
    });
    return response.data;
  },

  // Get team by ID
  getTeamById: async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  // Get team members
  getTeamMembers: async (id) => {
    const response = await api.get(`/teams/${id}/members`);
    return response.data;
  },

  // Get user's teams
  getMyTeams: async () => {
    const response = await api.get('/teams/my-teams');
    return response.data;
  },

  // Get teams for a specific user
  getTeamsForUser: async (userId) => {
    const response = await api.get(`/teams/user/${userId}`);
    return response.data;
  },

  // Create team
  createTeam: async (teamData) => {
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  // Update team
  updateTeam: async (id, teamData) => {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  },

  // Delete team
  deleteTeam: async (id, permanent = false) => {
    const response = await api.delete(`/teams/${id}`, {
      params: { permanent }
    });
    return response.data;
  },

  // Add member to team
  addMember: async (id, userId) => {
    const response = await api.post(`/teams/${id}/members`, { user_id: userId });
    return response.data;
  },

  // Bulk add members
  bulkAddMembers: async (id, userIds) => {
    const response = await api.post(`/teams/${id}/members/bulk`, { user_ids: userIds });
    return response.data;
  },

  // Remove member from team
  removeMember: async (teamId, userId) => {
    const response = await api.delete(`/teams/${teamId}/members/${userId}`);
    return response.data;
  },

  // Get team statistics
  getTeamStats: async () => {
    const response = await api.get('/teams/stats');
    return response.data;
  }
};