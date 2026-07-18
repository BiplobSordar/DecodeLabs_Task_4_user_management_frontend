import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/task.service';
import { teamService } from '../../services/team.service';
import { userService } from '../../services/user.service';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2,
  ClipboardList,
  Calendar,
  UserCheck,
  Users,
  Flag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Mail,
  Briefcase,
  User
} from 'lucide-react';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import toast from 'react-hot-toast';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
    fetchUsers();
  }, [id]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const response = await taskService.getTaskById(id);
      setTask(response.data);
    } catch (error) {
      toast.error('Failed to load task details');
      navigate('/tasks');
    } finally {
      setLoading(false);
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

  const handleStatusChange = async (status) => {
    try {
      await taskService.updateTaskStatus(id, status);
      toast.success(`Task ${status} successfully`);
      fetchTaskDetails();
    } catch (error) {
      toast.error(error.message || 'Failed to update task status');
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    setIsSubmitting(true);
    try {
      await taskService.assignTask(id, parseInt(selectedUser));
      toast.success('Task assigned successfully');
      setShowAssignModal(false);
      setSelectedUser('');
      fetchTaskDetails();
    } catch (error) {
      toast.error(error.message || 'Failed to assign task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await taskService.deleteTask(id, true);
      toast.success('Task deleted successfully');
      navigate('/tasks');
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  const canEdit = currentUser?.permissions?.includes('update_task');
  const canDelete = currentUser?.permissions?.includes('delete_task');
  const canAssign = currentUser?.permissions?.includes('assign_task');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Task not found</p>
        <Link to="/tasks" className="btn-primary mt-4 inline-block">
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link to="/tasks" className="inline-flex items-center text-muted hover:text-text-h transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
          <h1 className="section-title mt-2">{task.title}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {canEdit && (
            <Link to={`/tasks/${id}/edit`} className="btn-primary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Task
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

      {/* Task Details */}
      <div className="space-y-6">
        {/* Main Info Card */}
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
            </div>
            <div className="flex items-center gap-2">
              {canAssign && task.status !== 'completed' && (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="btn-secondary text-sm"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign
                </button>
              )}
              {canEdit && task.status !== 'completed' && (
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="input-base text-sm py-1 px-3 w-auto"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )}
            </div>
          </div>

          {task.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-h mb-2">Description</h3>
              <p className="text-muted text-sm whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-muted" />
              <span className="text-muted">Team:</span>
              <span className="font-medium text-text-h">{task.team_name || 'No Team'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted" />
              <span className="text-muted">Assigned to:</span>
              <span className="font-medium text-text-h">{task.assigned_to_name || 'Unassigned'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted" />
              <span className="text-muted">Due Date:</span>
              <span className="font-medium text-text-h">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted" />
              <span className="text-muted">Created by:</span>
              <span className="font-medium text-text-h">{task.created_by_name || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted" />
              <span className="text-muted">Created:</span>
              <span className="font-medium text-text-h">
                {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
            {task.completed_at && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-muted">Completed:</span>
                <span className="font-medium text-text-h">
                  {new Date(task.completed_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-lg border border-border animate-enter">
            <h3 className="text-lg font-semibold text-text-h mb-2">
              Assign Task
            </h3>
            <p className="text-muted text-sm mb-4">
              Assign "{task.title}" to a team member
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
                {users.filter(u => u.is_active).map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} (@{user.username})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedUser('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="btn-primary"
                disabled={isSubmitting || !selectedUser}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assigning...
                  </span>
                ) : (
                  'Assign Task'
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
                <h3 className="text-lg font-semibold text-text-h">Delete Task</h3>
                <p className="text-muted text-sm mt-1">
                  Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
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
                  'Delete Task'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;