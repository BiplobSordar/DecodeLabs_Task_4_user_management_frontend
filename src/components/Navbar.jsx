import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Shield,
  ClipboardList,
  Settings,
  Bell,
  ChevronDown,
  Briefcase
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Check permissions
  const canViewUsers = user?.permissions?.includes('view_users');
  const canViewTeams = user?.permissions?.includes('view_teams');
  const canViewTasks = user?.permissions?.includes('view_tasks');

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { path: '/users', label: 'Users', icon: Users, show: canViewUsers },
    { path: '/teams', label: 'Teams', icon: Briefcase, show: canViewTeams },
    { path: '/tasks', label: 'Tasks', icon: ClipboardList, show: canViewTasks },
  ].filter(item => item.show);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-bg border-2 border-accent-border flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xl font-bold text-accent">UMS</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'bg-accent-bg text-accent'
                        : 'text-muted hover:bg-social-bg hover:text-text-h'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-social-bg transition">
                <Bell className="w-5 h-5 text-muted" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-social-bg transition"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-bg border-2 border-accent-border flex items-center justify-center">
                    <span className="text-sm font-semibold text-accent">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-text-h">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-muted">{user?.role_name}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-lg border border-border py-1 z-50 animate-enter">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-text-h hover:bg-social-bg transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserIcon className="w-4 h-4 text-muted" />
                      Profile
                    </Link>
                    <Link
                      to="/#"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-text-h hover:bg-social-bg transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-muted" />
                      Settings
                    </Link>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-social-bg transition menu-button"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-text-h" />
                ) : (
                  <Menu className="w-6 h-6 text-text-h" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Slide from right */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-[70%] max-w-sm bg-surface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-bg border-2 border-accent-border flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold text-accent">UMS</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-social-bg transition"
          >
            <X className="w-5 h-5 text-text-h" />
          </button>
        </div>

        {/* Mobile Menu User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent-bg border-2 border-accent-border flex items-center justify-center">
              <span className="text-lg font-semibold text-accent">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-text-h">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-sm text-muted">{user?.role_name}</p>
            </div>
          </div>
        </div>

        {/* Mobile Menu Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-accent-bg text-accent'
                  : 'text-muted hover:bg-social-bg hover:text-text-h'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          <hr className="my-2 border-border" />
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-social-bg hover:text-text-h transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <UserIcon className="w-5 h-5" />
            Profile
          </Link>
          <Link
            to="/#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-social-bg hover:text-text-h transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-danger hover:bg-danger/10 transition w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;