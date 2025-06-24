import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800 mt-auto">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-300">
            © 2025 GuildKeeper
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 