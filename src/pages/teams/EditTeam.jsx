import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTeams } from '../../hooks/useTeams';
import { teamService } from '../../services/team.service';
import { userService } from '../../services/user.service';
import { ArrowLeft, Loader2, Save, Briefcase, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTeam, loading } = useTeams();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team_lead_id: '',
    is_active: true
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchTeam();
    fetchUsers();
  }, [id]);

  const fetchTeam = async () => {
    try {
      const response = await teamService.getTeamById(id);
      const team = response.data;
      setFormData({
        name: team.name || '',
        description: team.description || '',
        team_lead_id: team.team_lead_id || '',
        is_active: team.is_active !== undefined ? team.is_active : true
      });
    } catch (error) {
      toast.error('Failed to load team');
      navigate('/teams');
    } finally {
      setFetching(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers(1, 100);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Team name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Team name must be less than 100 characters';
    }

    if (formData.team_lead_id && !Number.isInteger(Number(formData.team_lead_id))) {
      newErrors.team_lead_id = 'Invalid team lead';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);
  try {
    //  Prepare data - convert empty string to null for team_lead_id
    const submitData = {
      name: formData.name,
      description: formData.description,
      team_lead_id: formData.team_lead_id || null, // Send null if empty
      is_active: formData.is_active
    };
    
    await updateTeam(id, submitData);
    navigate(`/teams/${id}`);
  } catch (error) {
    // Error is handled by useTeams hook
  } finally {
    setIsSubmitting(false);
  }
};

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/teams/${id}`} className="inline-flex items-center text-muted hover:text-text-h transition">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Team
        </Link>
        <h1 className="section-title mt-2">Edit Team</h1>
        <p className="text-muted text-sm">Update team information and settings</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              Team Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-base ${errors.name ? 'error' : ''}`}
              placeholder="Enter team name"
            />
            {errors.name && (
              <p className="text-danger text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-base min-h-[100px]"
              placeholder="Describe the team's purpose..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              Team Lead
            </label>
            <select
              name="team_lead_id"
              value={formData.team_lead_id}
              onChange={handleChange}
              className="input-base"
            >
              <option value="">Select a team lead...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} (@{user.username})
                </option>
              ))}
            </select>
            {formData.team_lead_id && (
              <p className="text-xs text-muted mt-1">
                Team lead will be automatically added as a member
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 bg-accent-bg/30 rounded-lg border border-accent-border/30">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="rounded border-border text-accent focus:ring-accent/20"
            />
            <label className="text-sm text-text-h">
              <span className="font-medium">Active</span>
              <span className="text-muted ml-1">- Team is visible to members</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
            <Link to={`/teams/${id}`} className="btn-secondary w-full sm:w-auto">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn-primary w-full sm:w-auto"
            >
              {(isSubmitting || loading) ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Update Team
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeam;