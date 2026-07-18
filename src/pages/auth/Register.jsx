import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  Users,
  Loader2
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (serverError) {
      setServerError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscore';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setServerError('');
    setErrors({});
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        navigate('/');
      } else {
        setServerError(result.error || 'Registration failed. Please try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Register error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4 border-2 border-success/20">
          <Users className="w-8 h-8 text-success" />
        </div>
        <h2 className="section-title">Create Account</h2>
        <p className="text-muted text-sm mt-1">Join us and get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              First Name <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-muted" />
              </div>
              <input
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className={`input-base pl-9 ${errors.first_name ? 'error' : ''}`}
                placeholder="John"
                disabled={isSubmitting || loading}
              />
            </div>
            {errors.first_name && (
              <p className="text-danger text-xs mt-1">{errors.first_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-h mb-1">
              Last Name <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-muted" />
              </div>
              <input
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className={`input-base pl-9 ${errors.last_name ? 'error' : ''}`}
                placeholder="Doe"
                disabled={isSubmitting || loading}
              />
            </div>
            {errors.last_name && (
              <p className="text-danger text-xs mt-1">{errors.last_name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-h mb-1">
            Username <span className="text-danger">*</span>
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
              placeholder="johndoe"
              disabled={isSubmitting || loading}
            />
          </div>
          {errors.username && (
            <p className="text-danger text-xs mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-h mb-1">
            Email <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted" />
            </div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-base pl-10 ${errors.email ? 'error' : ''}`}
              placeholder="john@example.com"
              disabled={isSubmitting || loading}
            />
          </div>
          {errors.email && (
            <p className="text-danger text-xs mt-1">{errors.email}</p>
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
              placeholder="Min. 8 characters with uppercase, lowercase & number"
              disabled={isSubmitting || loading}
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

        <div>
          <label className="block text-sm font-medium text-text-h mb-1">
            Confirm Password <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted" />
            </div>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-base pl-10 pr-10 ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              disabled={isSubmitting || loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-text-h transition"
              disabled={isSubmitting || loading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-danger text-xs mt-1">{errors.confirmPassword}</p>
          )}
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
              Creating account...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </span>
          )}
        </button>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-accent hover:text-primary-dark font-medium transition">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
};

export default Register;