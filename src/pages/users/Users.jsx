import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../../hooks/useUsers';
import { userService } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users as UsersIcon,
  UserPlus,
  Shield,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import UserStats from './UserStats';

const Users = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const {
    users,
    loading,
    pagination,
    search,
    selectedUsers,
    fetchUsers,
    deleteUser,
    updateUserStatus,
    bulkAssignRole,
    toggleSelection,
    selectAll,
    setSearch
  } = useUsers();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [bulkRoleId, setBulkRoleId] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await userService.getRoles();
        setRoles(response.data);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, pagination.limit, search);
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, pagination.limit, search);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser.id, !selectedUser.is_active);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleStatusToggle = async (user) => {
    await updateUserStatus(user.id, !user.is_active);
  };

  const handleBulkRoleAssign = async () => {
    if (!bulkRoleId || selectedUsers.length === 0) return;
    await bulkAssignRole(selectedUsers, parseInt(bulkRoleId));
    setShowBulkModal(false);
    setBulkRoleId('');
  };

  const canCreate = currentUser?.permissions?.includes('create_user');
  const canEdit = currentUser?.permissions?.includes('update_user');
  const canDelete = currentUser?.permissions?.includes('delete_user');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">User Management</h1>
          <p className="text-muted text-sm mt-1">Manage your team members and their roles</p>
        </div>
        {canCreate && (
          <Link to="/users/new" className="btn-primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Link>
        )}
      </div>

      {/* Statistics Cards */}
      <UserStats />

      {/* Search and Filters */}
      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-10"
            />
          </div>
          <button type="submit" className="btn-primary px-6 whitespace-nowrap">
            Search
          </button>
          {selectedUsers.length > 0 && (
            <button
              type="button"
              onClick={() => setShowBulkModal(true)}
              className="btn-secondary px-6 whitespace-nowrap"
            >
              <Shield className="w-4 h-4 mr-2" />
              Bulk Assign ({selectedUsers.length})
            </button>
          )}
        </form>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent-bg/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={selectAll}
                    className="rounded border-border text-accent focus:ring-accent/20"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">
                  Teams
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent" />
                    <p className="mt-2 text-muted">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <UsersIcon className="w-16 h-16 mx-auto text-muted/30 mb-4" />
                    <p className="text-muted">No users found</p>
                    {search && <p className="text-sm text-muted mt-1">Try adjusting your search</p>}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-accent-bg/30 transition">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelection(user.id)}
                        className="rounded border-border text-accent focus:ring-accent/20"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-bg border-2 border-accent-border flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-accent">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-h truncate">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-muted truncate">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted hidden md:table-cell truncate max-w-[150px]">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="badge badge-info">
                        {user.role_name || 'Viewer'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {user.teams?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.teams.slice(0, 2).map((team, index) => (
                            <span key={index} className="badge badge-gray text-xs">
                              {team}
                            </span>
                          ))}
                          {user.teams.length > 2 && (
                            <span className="badge badge-gray text-xs">
                              +{user.teams.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted">No teams</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'} cursor-pointer hover:opacity-80 transition`}
                      >
                        {user.is_active ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {user.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="p-1.5 rounded-lg hover:bg-accent-bg text-muted hover:text-accent transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canEdit && (
                          <Link
                            to={`/users/${user.id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-accent-bg text-muted hover:text-accent transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition"
                            title={user.is_active ? 'Deactivate' : 'Delete'}
                          >
                            {user.is_active ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="px-4 py-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-bg transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-bg transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-lg border border-border animate-enter">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-h">
                  {selectedUser.is_active ? 'Deactivate User' : 'Delete User'}
                </h3>
                <p className="text-muted text-sm mt-1">
                  {selectedUser.is_active
                    ? `Are you sure you want to deactivate ${selectedUser.first_name} ${selectedUser.last_name}? They will not be able to log in.`
                    : `Are you sure you want to permanently delete ${selectedUser.first_name} ${selectedUser.last_name}? This action cannot be undone.`
                  }
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                {selectedUser.is_active ? 'Deactivate' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Role Assignment Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-lg border border-border animate-enter">
            <h3 className="text-lg font-semibold text-text-h mb-2">
              Bulk Assign Role
            </h3>
            <p className="text-muted text-sm mb-4">
              Assign a role to {selectedUsers.length} selected users
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-h mb-1">
                Select Role
              </label>
              <select
                value={bulkRoleId}
                onChange={(e) => setBulkRoleId(e.target.value)}
                className="input-base"
              >
                <option value="">Select a role...</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkRoleId('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkRoleAssign}
                disabled={!bulkRoleId}
                className="btn-primary"
              >
                Assign Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Users;