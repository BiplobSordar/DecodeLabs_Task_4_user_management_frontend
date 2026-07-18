import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/team.service';
import { userService } from '../../services/user.service';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  UserPlus,
  UserMinus,
  Loader2,
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react';
import toast from 'react-hot-toast';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, [id]);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const [teamResponse, membersResponse] = await Promise.all([
        teamService.getTeamById(id),
        teamService.getTeamMembers(id)
      ]);
      setTeam(teamResponse.data);
      setMembers(membersResponse.data);
    } catch (error) {
      toast.error('Failed to load team details');
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await userService.getUsers(1, 100);
      const memberIds = members.map(m => m.id);
      const available = response.data.filter(u => !memberIds.includes(u.id));
      setAvailableUsers(available);
    } catch (error) {
      toast.error('Failed to load available users');
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    setIsSubmitting(true);
    try {
      await teamService.addMember(id, parseInt(selectedUser));
      toast.success('Member added successfully');
      setShowAddMemberModal(false);
      setSelectedUser('');
      fetchTeamData();
    } catch (error) {
      toast.error(error.message || 'Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await teamService.removeMember(id, userId);
      toast.success('Member removed successfully');
      fetchTeamData();
    } catch (error) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const handleDeleteTeam = async () => {
    setIsSubmitting(true);
    try {
      await teamService.deleteTeam(id, true);
      toast.success('Team deleted successfully');
      navigate('/teams');
    } catch (error) {
      toast.error(error.message || 'Failed to delete team');
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  const canEdit = currentUser?.permissions?.includes('update_team');
  const canDelete = currentUser?.permissions?.includes('delete_team');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Team not found</p>
        <Link to="/teams" className="btn-primary mt-4 inline-block">
          Back to Teams
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link to="/teams" className="inline-flex items-center text-muted hover:text-text-h transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Link>
          <h1 className="section-title mt-2">{team.name}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {canEdit && (
            <Link to={`/teams/${id}/edit`} className="btn-primary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Team
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

      {/* Team Info */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-accent-bg border-2 border-accent-border flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-8 h-8 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-4">
              <span className={`badge ${team.is_active ? 'badge-success' : 'badge-danger'}`}>
                {team.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="badge badge-info">
                {team.member_count || 0} Members
              </span>
              <span className="badge badge-gray">
                {team.task_count || 0} Tasks
              </span>
            </div>
            {team.description && (
              <p className="text-muted mt-3">{team.description}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted">
                <UserCheck className="w-4 h-4" />
                <span>Lead: {team.team_lead_name || 'Not assigned'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(team.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-text-h">{team.task_count || 0}</p>
          <p className="text-xs text-muted uppercase tracking-wider">Total Tasks</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-success">{team.completed_tasks || 0}</p>
          <p className="text-xs text-muted uppercase tracking-wider">Completed</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-warning">{team.pending_tasks || 0}</p>
          <p className="text-xs text-muted uppercase tracking-wider">Pending</p>
        </div>
      </div>

      {/* Members Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-h flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Members ({members.length})
          </h3>
          <button
            onClick={() => {
              setShowAddMemberModal(true);
              fetchAvailableUsers();
            }}
            className="btn-primary text-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>

        <div className="space-y-2">
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-accent-bg/30 rounded-lg border border-accent-border/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-bg border-2 border-accent-border flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent">
                      {member.first_name?.[0]}{member.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-h">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-xs text-muted flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {member.email}
                      {member.role_name && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-muted"></span>
                          <span>{member.role_name}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.id === team.team_lead_id && (
                    <span className="badge badge-warning">Lead</span>
                  )}
                  {member.id !== team.team_lead_id && canEdit && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition"
                      title="Remove member"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted text-center py-8">No members yet</p>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-lg border border-border animate-enter">
            <h3 className="text-lg font-semibold text-text-h mb-2">
              Add Member
            </h3>
            <p className="text-muted text-sm mb-4">
              Select a user to add to {team.name}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-h mb-1">
                Select User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="input-base"
              >
                <option value="">Select a user...</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} (@{user.username})
                  </option>
                ))}
              </select>
              {availableUsers.length === 0 && (
                <p className="text-xs text-muted mt-1">No available users to add</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedUser('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="btn-primary"
                disabled={isSubmitting || !selectedUser}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </span>
                ) : (
                  'Add Member'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-lg border border-border animate-enter">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-h">Delete Team</h3>
                <p className="text-muted text-sm mt-1">
                  Are you sure you want to permanently delete <strong>{team.name}</strong>? 
                  This will remove all members and associated tasks.
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
                onClick={handleDeleteTeam}
                className="btn-danger"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete Team'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;