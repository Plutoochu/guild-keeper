import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Shield,
  Home,
  BookOpen,
  Swords
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Uspješno ste se odjavili');
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const NavLink = ({ to, children, icon: Icon, onClick }: any) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-yellow-300 hover:bg-white/10 transition-colors"
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Link>
  );

  return (
    <header className="bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Swords className="h-5 w-5 text-slate-900" />
              </div>
              <h1 className="text-xl font-bold text-white">GuildKeeper</h1>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" icon={Home}>Početna</NavLink>
              
              {isAuthenticated && isAdmin && (
                <NavLink to="/admin" icon={Shield}>Admin Panel</NavLink>
              )}
              
              <NavLink to="/posts" icon={BookOpen}>Objave</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-yellow-300 transition-colors"
                >
                  Prijava
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-yellow-500 text-slate-900 text-sm font-medium rounded-md hover:bg-yellow-400 transition-colors"
                >
                  Registracija
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  {user?.slika ? (
                    <img
                      src={`http://localhost:5000${user.slika}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-900" />
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-white">
                      {user?.ime} {user?.prezime || ''}
                    </div>
                    <div className="text-xs text-gray-300">
                      {isAdmin ? 'Dungeon Master' : 'Adventurer'}
                    </div>
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      Profil
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Odjava
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors text-white"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <nav className="flex flex-col gap-2">
              <NavLink to="/" icon={Home} onClick={() => setIsMenuOpen(false)}>
                Početna
              </NavLink>
              
              {isAuthenticated && isAdmin && (
                <NavLink to="/admin" icon={Shield} onClick={() => setIsMenuOpen(false)}>
                  Admin Panel
                </NavLink>
              )}
              
              <NavLink to="/posts" icon={BookOpen} onClick={() => setIsMenuOpen(false)}>
                Objave
              </NavLink>
              
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" icon={Settings} onClick={() => setIsMenuOpen(false)}>
                    Profil
                  </NavLink>
                  
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Odjava
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                    Prijava
                  </NavLink>
                  <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                    Registracija
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar; 