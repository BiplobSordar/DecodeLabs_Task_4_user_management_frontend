import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUsers } from '../../hooks/useUsers';
import { userService } from '../../services/user.service';
import { ArrowLeft, Loader2, Save, UserCog, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateUser, loading } = useUsers();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role_id: '',
    is_active: true
  });
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await userService.getUserById(id);
      const user = response.data;
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role_id: user.role_id || '',
        is_active: user.is_active !== undefined ? user.is_active : true
      });
    } catch (error) {
      toast.error('Failed to load user');
      navigate('/users');
    } finally {
      setFetching(false);
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

    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateUser(id, formData);
      navigate(`/users/${id}`);
    } catch (error) {
      // Error is handled by useUsers hook
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
        <Link to={`/users/${id}`} className="inline-flex items-center text-muted hover:text-text-h transition">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Link>
        <h1 className="section-title mt-2">Edit User</h1>
        <p className="text-muted text-sm">Update user information and settings</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-h mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`input-base ${errors.first_name ? 'error' : ''}`}
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-h mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`input-base ${errors.last_name ? 'error' : ''}`}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`input-base ${errors.username ? 'error' : ''}`}
              placeholder="johndoe"
            />
            {errors.username && (
              <p className="text-danger text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-base ${errors.email ? 'error' : ''}`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              Role
            </label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
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
              <span className="text-muted ml-1">- User can log in</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
            <Link to={`/users/${id}`} className="btn-secondary w-full sm:w-auto">
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
                  Update User
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;