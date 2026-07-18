import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user.service';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch users
  const fetchUsers = useCallback(async (page = 1, limit = 10, searchTerm = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(page, limit, searchTerm);
      setUsers(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create user
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await userService.createUser(userData);
      toast.success('User created successfully');
      await fetchUsers(pagination.page, pagination.limit, search);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, pagination.limit, search]);

  // Update user
  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    try {
      const response = await userService.updateUser(id, userData);
      toast.success('User updated successfully');
      await fetchUsers(pagination.page, pagination.limit, search);
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, pagination.limit, search]);

  // Delete user
  const deleteUser = useCallback(async (id, permanent = false) => {
    setLoading(true);
    try {
      await userService.deleteUser(id, permanent);
      toast.success(permanent ? 'User permanently deleted' : 'User deactivated');
      await fetchUsers(pagination.page, pagination.limit, search);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, pagination.limit, search]);

  // Update user status
  const updateUserStatus = useCallback(async (id, isActive) => {
    setLoading(true);
    try {
      await userService.updateUserStatus(id, isActive);
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      await fetchUsers(pagination.page, pagination.limit, search);
    } catch (err) {
      toast.error(err.message || 'Failed to update user status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, pagination.limit, search]);

  // Assign role
  const assignRole = useCallback(async (id, roleId) => {
    setLoading(true);
    try {
      await userService.assignRole(id, roleId);
      toast.success('Role assigned successfully');
      await fetchUsers(pagination.page, pagination.limit, search);
    } catch (err) {
      toast.error(err.message || 'Failed to assign role');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, pagination.limit, search]);

  // Bulk assign role
  const bulkAssignRole = useCallback(async (userIds, roleId) => {
    setLoading(true);
    try {
      await userService.bulkAssignRole(userIds, roleId);
      toast.success('Roles assigned successfully');
      setSelectedUsers([]);
      await fetchUsers(pagination.page, pagination.limit, search);
    } catch (err) {
      toast.error(err.message || 'Failed to assign roles');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, pagination.limit, search]);

  // Toggle user selection
  const toggleSelection = useCallback((userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  // Select all users
  const selectAll = useCallback(() => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  }, [selectedUsers, users]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    search,
    selectedUsers,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    assignRole,
    bulkAssignRole,
    toggleSelection,
    selectAll,
    clearSelection,
    setSearch
  };
};