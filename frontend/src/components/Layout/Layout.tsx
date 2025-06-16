import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow border-b">
        <div className="container mx-auto px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                GuildKeeper
              </h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/" className="hover:text-blue-600">Početna</a>
              <a href="/login" className="hover:text-blue-600">Prijava</a>
              <a href="/register" className="hover:text-blue-600">Registracija</a>
            </nav>
          </div>
        </div>
      </header>
      
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