import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-500">
            © 2025 GuildKeeper
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 