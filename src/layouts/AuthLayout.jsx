import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="hero">
          <div className="base">
            <svg viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" fill="var(--color-accent-bg)" stroke="var(--color-accent)" strokeWidth="4"/>
              <path d="M100 40 L120 80 L100 70 L80 80 L100 40Z" fill="var(--color-accent)"/>
              <circle cx="100" cy="100" r="20" fill="var(--color-accent)" opacity="0.2"/>
            </svg>
          </div>
          <div className="framework">
            <svg viewBox="0 0 100 30" fill="none">
              <rect x="0" y="0" width="100" height="30" rx="6" fill="var(--color-accent-bg)" stroke="var(--color-accent)" strokeWidth="2"/>
              <text x="50" y="20" textAnchor="middle" fill="var(--color-accent)" fontSize="14" fontWeight="600">UMS</text>
            </svg>
          </div>
          <div className="vite">
            <svg viewBox="0 0 80 24" fill="none">
              <rect x="0" y="0" width="80" height="24" rx="4" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5"/>
              <text x="40" y="16" textAnchor="middle" fill="var(--color-text-h)" fontSize="12" fontWeight="500">Auth</text>
            </svg>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;