import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn,
  AlertCircle,
  Shield,
  Loader2,
  Users,
  Briefcase,
  Code,
  Bug,
  Eye as ViewIcon
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRole, setActiveRole] = useState(null);
  
  //  Add ref to prevent multiple submissions
  const isSubmittingRef = useRef(false);

  // Role presets with credentials
  const rolePresets = [
    {
      id: 'admin',
      label: 'Admin',
      icon: Shield,
      username: 'john.doe',
      email: 'john.doe@company.com',
      password: 'Password@123',
      color: 'text-red-600 border-red-200 hover:border-red-400 bg-red-50'
    },
    {
      id: 'manager',
      label: 'Manager',
      icon: Briefcase,
      username: 'jane.smith',
      email: 'jane.smith@company.com',
      password: 'Password@123',
      color: 'text-blue-600 border-blue-200 hover:border-blue-400 bg-blue-50'
    },
    {
      id: 'developer',
      label: 'Developer',
      icon: Code,
      username: 'bob.johnson',
      email: 'bob.johnson@company.com',
      password: 'Password@123',
      color: 'text-green-600 border-green-200 hover:border-green-400 bg-green-50'
    },
    {
      id: 'tester',
      label: 'Tester',
      icon: Bug,
      username: 'alice.williams',
      email: 'alice.williams@company.com',
      password: 'Password@123',
      color: 'text-purple-600 border-purple-200 hover:border-purple-400 bg-purple-50'
    },
    {
      id: 'viewer',
      label: 'Viewer',
      icon: ViewIcon,
      username: 'charlie.brown',
      email: 'charlie.brown@company.com',
      password: 'Password@123',
      color: 'text-gray-600 border-gray-200 hover:border-gray-400 bg-gray-50'
    }
  ];

  const handleRoleSelect = (role) => {
    setActiveRole(role.id);
    setFormData(prev => ({
      ...prev,
      username: role.email, // Using email as username
      password: role.password
    }));
    // Clear any existing errors
    setServerError('');
    setErrors({});
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
    
    if (serverError) {
      setServerError('');
    }
    
    // Clear active role when user manually changes credentials
    if (activeRole) {
      setActiveRole(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    //  Prevent multiple submissions
    if (isSubmittingRef.current) {
      console.log('⚠️ Submission already in progress');
      return;
    }
    
    setServerError('');
    setErrors({});
    
    if (!validateForm()) {
      return;
    }

    // Set submitting flag
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setServerError(result.error || 'Login failed. Please try again.');
        //  Reset submitting flag on error
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
      // Reset submitting flag on error
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
    // Don't reset here - let success/failure handle it
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-bg mb-4 border-2 border-accent-border">
          <Shield className="w-8 h-8 text-accent" />
        </div>
        <h2 className="section-title">Welcome Back</h2>
        <p className="text-muted text-sm mt-1">Sign in to your account to continue</p>
      </div>

      {/* Role Presets */}
      <div className="mb-6">
        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3 text-center">
          Quick Login as
        </p>
        <div className="grid grid-cols-5 gap-2">
          {rolePresets.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                  isActive
                    ? `${role.color} border-2 border-current`
                    : `${role.color} border-transparent hover:border-current`
                }`}
                title={`Login as ${role.label}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-current' : ''}`} />
                <span className={`text-xs font-medium mt-1 ${isActive ? 'text-current' : ''}`}>
                  {role.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label className="block text-sm font-medium text-text-h mb-1">
            Username or Email <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-muted" />
            </div>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`input-base pl-10 ${errors.username ? 'error' : ''}`}
              placeholder="Enter your username or email"
              disabled={isSubmitting || loading}
              autoComplete="username"
            />
          </div>
          {errors.username && (
            <p className="text-danger text-xs mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-h mb-1">
            Password <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted" />
            </div>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`input-base pl-10 pr-10 ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              disabled={isSubmitting || loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-text-h transition"
              disabled={isSubmitting || loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-danger text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm text-muted cursor-pointer">
            <input
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="rounded border-border text-accent focus:ring-accent/20"
              disabled={isSubmitting || loading}
            />
            <span>Remember me</span>
          </label>
          <Link 
            to="/auth/forgot-password"
            className="text-sm text-accent hover:text-primary-dark font-medium transition"
          >
            Forgot password?
          </Link>
        </div>

        {serverError && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 animate-shake">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
              <p className="text-danger text-sm">{serverError}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="btn-primary w-full py-2.5"
        >
          {(isSubmitting || loading) ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </span>
          )}
        </button>

        <p className="text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-accent hover:text-primary-dark font-medium transition">
            Create one
          </Link>
        </p>
      </form>

      {/* Role Info - Show active role */}
      {activeRole && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted">
            Logging in as <span className="font-medium text-accent">
              {rolePresets.find(r => r.id === activeRole)?.label}
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default Login;