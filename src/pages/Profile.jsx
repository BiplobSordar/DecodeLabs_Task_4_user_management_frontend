import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Users,
  Briefcase,
  CheckCircle,
  Edit,
  Save,
  X,
  Loader2,
  Camera,
  Key,
  Clock,
  Activity,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserProfile();
      console.log('Profile response:', response);
      const data = response.data;
      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        username: data.username || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.current_password) {
      newErrors.current_password = 'Current password is required';
    }
    
    if (!passwordData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    
    if (!passwordData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    
    setIsSubmitting(true);
    try {
      await userService.updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    
    setIsSubmitting(true);
    try {
      await userService.changePassword(
        passwordData.current_password,
        passwordData.new_password
      );
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      username: profile?.username || '',
    });
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordErrors({});
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-muted mb-4" />
        <h3 className="text-lg font-semibold text-text-h">Profile not found</h3>
        <p className="text-muted text-sm mt-1">Unable to load your profile</p>
        <button onClick={fetchProfile} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Profile</h1>
          <p className="text-muted text-sm">Manage your personal information</p>
        </div>
        <div className="flex gap-3">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="btn-secondary"
          >
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-accent-bg border-4 border-accent-border flex items-center justify-center">
                <span className="text-3xl font-bold text-accent">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </span>
              </div>
              <button 
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-accent text-white hover:bg-accent-dark transition"
                title="Change avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-h mb-1">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={`input-base ${errors.first_name ? 'error' : ''}`}
                    />
                    {errors.first_name && (
                      <p className="text-danger text-xs mt-1">{errors.first_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-h mb-1">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className={`input-base ${errors.last_name ? 'error' : ''}`}
                    />
                    {errors.last_name && (
                      <p className="text-danger text-xs mt-1">{errors.last_name}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-h mb-1">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-base ${errors.email ? 'error' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-danger text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-h mb-1">
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`input-base ${errors.username ? 'error' : ''}`}
                  />
                  {errors.username && (
                    <p className="text-danger text-xs mt-1">{errors.username}</p>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div>
                  <h2 className="text-2xl font-bold text-text-h">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-muted">@{profile.username}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Shield className="w-4 h-4" />
                    <span>Role: <span className="font-medium text-text-h">{profile.role_name || 'Viewer'}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Calendar className="w-4 h-4" />
                    <span>Joined: {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Clock className="w-4 h-4" />
                    <span>Last Login: {profile.last_login ? new Date(profile.last_login).toLocaleString() : 'Never'}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-muted">Teams:</span>
                    <span className="font-medium text-text-h">{profile.teams?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-accent" />
                    <span className="text-muted">Permissions:</span>
                    <span className="font-medium text-text-h">{profile.permissions?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UserCheck className="w-4 h-4 text-success" />
                    <span className="text-muted">Status:</span>
                    <span className={`font-medium ${profile.is_active ? 'text-success' : 'text-danger'}`}>
                      {profile.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Teams Section */}
      {profile.teams && profile.teams.length > 0 && !isEditing && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-h mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Your Teams
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.teams.map((team) => (
              <Link
                key={team?.id}
                to={`/teams/${team?.id}`}
                className="flex items-center gap-3 p-3 bg-accent-bg/30 rounded-lg border border-accent-border/20 hover:border-accent-border hover:bg-accent-bg/50 transition"
              >
                <div className="w-8 h-8 rounded-full bg-accent-bg border-2 border-accent-border flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-text-h truncate">{team?.name}</p>
                  {team?.description && (
                    <p className="text-xs text-muted truncate">{team?.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Permissions Section */}
      {profile.permissions && profile.permissions.length > 0 && !isEditing && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-h mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Your Permissions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {profile.permissions.map((permission) => (
              <div
                key={permission}
                className="flex items-center gap-2 text-sm text-muted p-2 bg-accent-bg/30 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="truncate">{permission.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-lg border border-border animate-enter">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-h">Change Password</h3>
              <button
                onClick={handleCancelPassword}
                className="p-1 rounded-lg hover:bg-accent-bg text-muted hover:text-text-h transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-h mb-1">
                  Current Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className={`input-base ${passwordErrors.current_password ? 'error' : ''}`}
                  placeholder="Enter current password"
                />
                {passwordErrors.current_password && (
                  <p className="text-danger text-xs mt-1">{passwordErrors.current_password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-h mb-1">
                  New Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className={`input-base ${passwordErrors.new_password ? 'error' : ''}`}
                  placeholder="Enter new password (min 8 characters)"
                />
                {passwordErrors.new_password && (
                  <p className="text-danger text-xs mt-1">{passwordErrors.new_password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-h mb-1">
                  Confirm New Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className={`input-base ${passwordErrors.confirm_password ? 'error' : ''}`}
                  placeholder="Confirm new password"
                />
                {passwordErrors.confirm_password && (
                  <p className="text-danger text-xs mt-1">{passwordErrors.confirm_password}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelPassword}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changing...
                    </span>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;