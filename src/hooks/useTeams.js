import { useState, useEffect, useCallback } from 'react';
import { teamService } from '../services/team.service';
import { userService } from '../services/user.service';
import toast from 'react-hot-toast';

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [search, setSearch] = useState('');
  const [userTeams, setUserTeams] = useState([]);

  // Fetch teams with pagination and search
  const fetchTeams = useCallback(async (page = 1, limit = 10, searchTerm = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamService.getTeams(page, limit, searchTerm);
      setTeams(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch teams');
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's teams (for membership detection)
  const fetchUserTeams = useCallback(async () => {
    try {
      const response = await teamService.getMyTeams();
      setUserTeams(response.data || []);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user teams:', error);
      return [];
    }
  }, []);

  // Get team by ID with full details
  const getTeamById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await teamService.getTeamById(id);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to load team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get team members
  const getTeamMembers = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await teamService.getTeamMembers(id);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to load team members');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create team
  const createTeam = useCallback(async (teamData) => {
    setLoading(true);
    try {
      // Ensure team_lead_id is properly handled
      const data = {
        ...teamData,
        team_lead_id: teamData.team_lead_id || null
      };
      
      const response = await teamService.createTeam(data);
      toast.success('Team created successfully');
      await fetchTeams(pagination.page, pagination.limit, search);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to create team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTeams, pagination.page, pagination.limit, search]);

  // Update team
  const updateTeam = useCallback(async (id, teamData) => {
    setLoading(true);
    try {
      // Ensure team_lead_id is properly handled
      const data = {
        ...teamData,
        team_lead_id: teamData.team_lead_id || null
      };
      
      const response = await teamService.updateTeam(id, data);
      toast.success('Team updated successfully');
      await fetchTeams(pagination.page, pagination.limit, search);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to update team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTeams, pagination.page, pagination.limit, search]);

  // Delete team
  const deleteTeam = useCallback(async (id, permanent = false) => {
    setLoading(true);
    try {
      await teamService.deleteTeam(id, permanent);
      toast.success(permanent ? 'Team permanently deleted' : 'Team deactivated');
      await fetchTeams(pagination.page, pagination.limit, search);
    } catch (err) {
      toast.error(err.message || 'Failed to delete team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTeams, pagination.page, pagination.limit, search]);

  // Add member to team
  const addMember = useCallback(async (teamId, userId) => {
    setLoading(true);
    try {
      await teamService.addMember(teamId, userId);
      toast.success('Member added successfully');
      // Refresh user teams
      await fetchUserTeams();
    } catch (err) {
      toast.error(err.message || 'Failed to add member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserTeams]);

  // Remove member from team
  const removeMember = useCallback(async (teamId, userId) => {
    setLoading(true);
    try {
      await teamService.removeMember(teamId, userId);
      toast.success('Member removed successfully');
      // Refresh user teams
      await fetchUserTeams();
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserTeams]);

  // Bulk add members
  const bulkAddMembers = useCallback(async (teamId, userIds) => {
    setLoading(true);
    try {
      await teamService.bulkAddMembers(teamId, userIds);
      toast.success('Members added successfully');
      await fetchUserTeams();
    } catch (err) {
      toast.error(err.message || 'Failed to add members');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserTeams]);

  // Check if user is a member of a team
  const isTeamMember = useCallback((teamId) => {
    return userTeams.some(team => team.id === teamId);
  }, [userTeams]);

  // Check if user is a team lead
  const isTeamLead = useCallback((teamId) => {
    const team = userTeams.find(t => t.id === teamId);
    return team ? team.team_lead_id === team.team_lead_id : false;
  }, [userTeams]);

  // Get user's teams
  const getMyTeams = useCallback(() => {
    return userTeams;
  }, [userTeams]);

  // Get teams count
  const getTeamsCount = useCallback(() => {
    return pagination.total;
  }, [pagination.total]);

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchTeams(pagination.page, pagination.limit, search),
      fetchUserTeams()
    ]);
  }, [fetchTeams, fetchUserTeams, pagination.page, pagination.limit, search]);

  // Get team statistics
  const getTeamStats = useCallback(async () => {
    try {
      const response = await teamService.getTeamStats();
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to fetch team stats');
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchTeams(),
        fetchUserTeams()
      ]);
    };
    init();
  }, []);

  return {
    // State
    teams,
    loading,
    error,
    pagination,
    search,
    userTeams,
    
    // Fetch functions
    fetchTeams,
    fetchUserTeams,
    getTeamById,
    getTeamMembers,
    getTeamStats,
    
    // CRUD operations
    createTeam,
    updateTeam,
    deleteTeam,
    
    // Member management
    addMember,
    removeMember,
    bulkAddMembers,
    
    // Helper functions
    isTeamMember,
    isTeamLead,
    getMyTeams,
    getTeamsCount,
    refresh,
    
    // Setters
    setSearch
  };
};