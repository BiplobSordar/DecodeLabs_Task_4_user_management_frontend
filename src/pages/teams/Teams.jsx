import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTeams } from '../../hooks/useTeams';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  Users, 
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Briefcase,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Star,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import TeamStats from '../../components/teams/TeamStats';

// Debounce hook
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Teams = () => {
  const { user } = useAuth();
  const {
    teams,
    loading,
    pagination,
    search,
    userTeams,
    fetchTeams,
    deleteTeam,
    setSearch,
    isTeamMember,
    getMyTeams
  } = useTeams();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchInput, setSearchInput] = useState(search);
  
  // Collapsible sections state
  const [sections, setSections] = useState({
    myTeams: true,
    allTeams: true
  });

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 500);

  // Separate teams into "My Teams" and "Other Teams"
  const myTeams = teams.filter(team => isTeamMember(team.id));
  const otherTeams = teams.filter(team => !isTeamMember(team.id));

  const canCreate = user?.permissions?.includes('create_team');
  const canEdit = user?.permissions?.includes('update_team');
  const canDelete = user?.permissions?.includes('delete_team');

  // Fetch teams when debounced search changes
  useEffect(() => {
    fetchTeams(1, pagination.limit, debouncedSearch);
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setSearch(value);
  };

  const handlePageChange = (newPage) => {
    fetchTeams(newPage, pagination.limit, search);
  };

  const handleDelete = async () => {
    if (!selectedTeam) return;
    setIsSubmitting(true);
    try {
      await deleteTeam(selectedTeam.id, !selectedTeam.is_active);
      setShowDeleteModal(false);
      setSelectedTeam(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle section collapse
  const toggleSection = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Render team card
  const renderTeamCard = (team, isMember = false) => (
    <div key={team.id} className="card p-6 hover:card-hover transition relative">
      {/* Member Badge */}
      {/* {isMember && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
            <CheckCircle className="w-3 h-3" />
            Member
          </span>
        </div>
      )} */}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            isMember 
              ? 'bg-success/10 border-success/20 text-success' 
              : 'bg-accent-bg border-accent-border text-accent'
          }`}>
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-text-h">{team.name}</h3>
            <p className="text-xs text-muted">
              Lead: {team.team_lead_name || 'Not assigned'}
            </p>
          </div>
        </div>
        <span className={`badge ${team.is_active ? 'badge-success' : 'badge-danger'}`}>
          {team.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <p className="text-sm text-muted line-clamp-2 mb-4">
        {team.description || 'No description'}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-muted">
            <Users className="w-4 h-4" />
            {team.member_count || 0} members
          </span>
          <span className="flex items-center gap-1 text-muted">
            <UserCheck className="w-4 h-4" />
            {team.completed_tasks || 0} done
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            to={`/teams/${team.id}`}
            className="p-1.5 rounded-lg hover:bg-accent-bg text-muted hover:text-accent transition"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {canEdit && (
            <Link
              to={`/teams/${team.id}/edit`}
              className="p-1.5 rounded-lg hover:bg-accent-bg text-muted hover:text-accent transition"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
          )}
          {canDelete && (
            <button
              onClick={() => {
                setSelectedTeam(team);
                setShowDeleteModal(true);
              }}
              className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition"
              title={team.is_active ? 'Deactivate' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render section header with collapse toggle
  const renderSectionHeader = (title, count, icon, sectionKey, isMember = false) => (
    <div 
      className="flex items-center justify-between gap-2 mb-4 cursor-pointer group"
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-text-h">{title}</h2>
        <span className="text-sm text-muted">({count})</span>
      </div>
      <div className="flex items-center gap-2">
        {isMember && (
          <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
            {count} teams
          </span>
        )}
        <button className="p-1 rounded-lg hover:bg-accent-bg transition group-hover:bg-accent-bg">
          {sections[sectionKey] ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Teams</h1>
          <p className="text-muted text-sm">Manage your teams and members</p>
        </div>
        {canCreate && (
          <Link to="/teams/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Link>
        )}
      </div>

      {/* Team Stats */}
      <TeamStats />

      {/* Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search teams by name or description..."
              value={searchInput}
              onChange={handleSearchChange}
              className="input-base pl-10"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setSearch('');
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-text-h transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-xs text-muted flex items-center">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <span>{pagination.total} teams found</span>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && teams.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : teams.length === 0 ? (
        <div className="card p-12 text-center">
          <Briefcase className="w-16 h-16 mx-auto text-muted/30 mb-4" />
          <h3 className="text-lg font-semibold text-text-h">No teams found</h3>
          <p className="text-muted text-sm mt-1">
            {search ? 'Try adjusting your search' : 'Create your first team to get started'}
          </p>
          {canCreate && (
            <Link to="/teams/new" className="btn-primary mt-4 inline-flex">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* My Teams Section */}
          {myTeams.length > 0 && (
            <div className="card p-4">
              {renderSectionHeader(
                'My Teams',
                myTeams.length,
                <Star className="w-5 h-5 text-yellow-500" />,
                'myTeams',
                true
              )}
              
              {sections.myTeams && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {myTeams.map((team) => renderTeamCard(team, true))}
                </div>
              )}
            </div>
          )}

          {/* Other Teams Section */}
          {otherTeams.length > 0 && (
            <div className="card p-4">
              {renderSectionHeader(
                'All Teams',
                otherTeams.length,
                <Briefcase className="w-5 h-5 text-muted" />,
                'allTeams'
              )}
              
              {sections.allTeams && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {otherTeams.map((team) => renderTeamCard(team, false))}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-sm text-muted">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} teams
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
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-lg border border-border animate-enter">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-h">
                  {selectedTeam.is_active ? 'Deactivate Team' : 'Delete Team'}
                </h3>
                <p className="text-muted text-sm mt-1">
                  {selectedTeam.is_active
                    ? `Are you sure you want to deactivate "${selectedTeam.name}"? Members will lose access.`
                    : `Are you sure you want to permanently delete "${selectedTeam.name}"? This action cannot be undone.`
                  }
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTeam(null);
                }}
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
                    Processing...
                  </span>
                ) : (
                  selectedTeam.is_active ? 'Deactivate' : 'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;