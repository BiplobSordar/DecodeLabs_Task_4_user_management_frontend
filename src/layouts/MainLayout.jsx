import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Main Content */}
      <main className="page-container py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;