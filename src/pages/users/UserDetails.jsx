import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';
import { 
  ArrowLeft, 
  Edit, 
  UserX, 
  UserCheck,
  Mail,
  Calendar,
  Shield,
  Users,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Briefcase,
  Clock,
  Activity,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await userService.getUserById(id);
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to load user details');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await userService.getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleStatusToggle = async () => {
    try {
      await userService.updateUserStatus(user.id, !user.is_active);
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchUser();
    } catch (error) {
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await userService.deleteUser(user.id, true);
      toast.success('User deleted successfully');
      navigate('/users');
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  const handleRoleAssign = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.assignRole(user.id, parseInt(selectedRole));
      toast.success('Role assigned successfully');
      fetchUser();
      setShowRoleModal(false);
      setSelectedRole('');
    } catch (error) {
      toast.error(error.message || 'Failed to assign role');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">User not found</p>
        <Link to="/users" className="btn-primary mt-4 inline-block">
          Back to Users
        </Link>
      </div>
    );
  }

  const canEdit = currentUser?.permissions?.includes('update_user');
  const canDelete = currentUser?.permissions?.includes('delete_user');
  const canManageRoles = currentUser?.permissions?.includes('manage_roles');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link to="/users" className="inline-flex items-center text-muted hover:text-text-h transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Link>
          <h1 className="section-title mt-2">User Profile</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {canEdit && (
            <Link to={`/users/${user.id}/edit`} className="btn-primary">
              <Edit className="w-4 h-4 mr-2" />
              Edit User
            </Link>
          )}
          {canDelete && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-danger"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* User Info Card */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-accent-bg border-2 border-accent-border flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-semibold text-accent">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-text-h">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-muted">@{user.username}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
                {canEdit && (
                  <button
                    onClick={handleStatusToggle}
                    className={`badge ${user.is_active ? 'badge-warning' : 'badge-success'} cursor-pointer hover:opacity-80 transition`}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Shield className="w-4 h-4" />
                <span>
                  Role: <span className="font-medium text-text-h">{user.role_name || 'Viewer'}</span>
                  {canManageRoles && (
                    <button
                      onClick={() => setShowRoleModal(true)}
                      className="ml-2 text-accent hover:text-primary-dark text-xs font-medium"
                    >
                      (Change)
                    </button>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Users className="w-4 h-4" />
                <span>Teams: {user.teams?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar className="w-4 h-4" />
                <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="card p-6 mb-6">
        <h3 className="text-lg font-semibold text-text-h mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-accent" />
          Teams
        </h3>
        {user.teams && user.teams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.teams.map((team) => (
              <div key={team.id} className="flex items-center gap-3 p-3 bg-accent-bg/30 rounded-lg border border-accent-border/20">
                <div className="w-8 h-8 rounded-full bg-accent-bg border-2 border-accent-border flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-text-h truncate">{team.name}</p>
                  {team.description && (
                    <p className="text-xs text-muted truncate">{team.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">Not a member of any team</p>
        )}
      </div>

      {/* Permissions Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-h mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          Permissions
        </h3>
        {user.permissions && user.permissions.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {user.permissions.map((permission) => (
              <div key={permission} className="flex items-center gap-2 text-sm text-muted p-2 bg-accent-bg/30 rounded-lg">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="truncate">{permission.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">No permissions assigned</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-lg border border-border animate-enter">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-h">Delete User</h3>
                <p className="text-muted text-sm mt-1">
                  Are you sure you want to permanently delete <strong>{user.first_name} {user.last_name}</strong>? 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-lg border border-border animate-enter">
            <h3 className="text-lg font-semibold text-text-h mb-2">
              Assign Role
            </h3>
            <p className="text-muted text-sm mb-4">
              Select a new role for {user.first_name} {user.last_name}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-h mb-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
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
                  setShowRoleModal(false);
                  setSelectedRole('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleAssign}
                className="btn-primary"
                disabled={isSubmitting || !selectedRole}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assigning...
                  </span>
                ) : (
                  'Assign Role'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;