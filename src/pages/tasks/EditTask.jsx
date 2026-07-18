import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { taskService } from '../../services/task.service';
import { teamService } from '../../services/team.service';
import { userService } from '../../services/user.service';
import { 
  ArrowLeft, 
  Loader2, 
  Save, 
  ClipboardList,
  Users,
  UserCheck,
  Calendar,
  Flag,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTask, loading } = useTasks();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team_id: '',
    assigned_to: '',
    priority: 'medium',
    due_date: '',
    status: 'pending'
  });
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchTaskData();
    fetchTeamsAndUsers();
  }, [id]);

  // Fetch team members when team selection changes
  useEffect(() => {
    if (formData.team_id) {
      fetchTeamMembers(formData.team_id);
    } else {
      setTeamMembers([]);
    }
  }, [formData.team_id]);

  const fetchTaskData = async () => {
    try {
      const response = await taskService.getTaskById(id);
      const task = response.data;
      setFormData({
        title: task.title || '',
        description: task.description || '',
        team_id: task.team_id || '',
        assigned_to: task.assigned_to_id || '',
        priority: task.priority || 'medium',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        status: task.status || 'pending'
      });
    } catch (error) {
      toast.error('Failed to load task');
      navigate('/tasks');
    } finally {
      setFetching(false);
    }
  };

  const fetchTeamsAndUsers = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        teamService.getTeams(1, 100),
        userService.getUsers(1, 100)
      ]);
      setTeams(teamsRes.data || []);
      setAllUsers(usersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch teams and users:', error);
    }
  };

  const fetchTeamMembers = async (teamId) => {
    setLoadingMembers(true);
    try {
      const response = await teamService.getTeamMembers(teamId);
      setTeamMembers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setTeamMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.due_date && isNaN(new Date(formData.due_date).getTime())) {
      newErrors.due_date = 'Invalid due date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        team_id: formData.team_id ? parseInt(formData.team_id) : null,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        priority: formData.priority || 'medium',
        due_date: formData.due_date || null,
        status: formData.status || 'pending'
      };
      
      console.log('Updating task data:', submitData);
      
      await updateTask(id, submitData);
      navigate(`/tasks/${id}`);
    } catch (error) {
      console.error('Update task error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected team name for display
  const selectedTeam = teams.find(t => t.id === parseInt(formData.team_id));

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to={`/tasks/${id}`} className="inline-flex items-center text-muted hover:text-text-h transition">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Task
        </Link>
        <h1 className="section-title mt-2">Edit Task</h1>
        <p className="text-muted text-sm">Update task details and settings</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              Task Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-base ${errors.title ? 'error' : ''}`}
              placeholder="Enter task title"
              disabled={isSubmitting || loading}
            />
            {errors.title && (
              <p className="text-danger text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`input-base min-h-[120px] ${errors.description ? 'error' : ''}`}
              placeholder="Describe the task in detail..."
              disabled={isSubmitting || loading}
            />
            {errors.description && (
              <p className="text-danger text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Team and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-h mb-1">
                <Users className="w-4 h-4 inline mr-1" />
                Team
              </label>
              <select
                name="team_id"
                value={formData.team_id}
                onChange={handleChange}
                className="input-base"
                disabled={isSubmitting || loading}
              >
                <option value="">Select a team...</option>
                {teams.filter(t => t.is_active).map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.member_count || 0} members)
                  </option>
                ))}
              </select>
              {formData.team_id && (
                <p className="text-xs text-muted mt-1">
                  Selected: <span className="font-medium text-text-h">{selectedTeam?.name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-h mb-1">
                <UserCheck className="w-4 h-4 inline mr-1" />
                Assign To
              </label>
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                className="input-base"
                disabled={isSubmitting || loading || !formData.team_id || loadingMembers}
              >
                <option value="">
                  {!formData.team_id 
                    ? 'Select a team first...' 
                    : loadingMembers 
                      ? 'Loading members...' 
                      : 'Select a user...'}
                </option>
                {teamMembers.filter(u => u.is_active).map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} (@{user.username})
                  </option>
                ))}
              </select>
              {formData.team_id && teamMembers.length === 0 && !loadingMembers && (
                <p className="text-xs text-warning mt-1">
                  No active members in this team
                </p>
              )}
              {formData.team_id && (
                <p className="text-xs text-muted mt-1">
                  {teamMembers.filter(u => u.is_active).length} members available
                </p>
              )}
            </div>
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-h mb-1">
                <Flag className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input-base"
                disabled={isSubmitting || loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-h mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className={`input-base ${errors.due_date ? 'error' : ''}`}
                disabled={isSubmitting || loading}
              />
              {errors.due_date && (
                <p className="text-danger text-xs mt-1">{errors.due_date}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              <ClipboardList className="w-4 h-4 inline mr-1" />
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-base"
              disabled={isSubmitting || loading}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
            <Link to={`/tasks/${id}`} className="btn-secondary w-full sm:w-auto">
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
                  Update Task
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;