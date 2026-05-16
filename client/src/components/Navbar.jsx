import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 p-4 border-b border-[var(--color-neon-blue)]/30">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold neon-text uppercase tracking-widest">
          <Shield className="w-6 h-6" />
          <span>DataLeak Check</span>
        </Link>
        <div className="flex space-x-4 items-center">
          <Link to="/check" className="text-gray-300 hover:text-white transition-colors duration-200">
            Scanner
          </Link>
          <Link to="/password-strength" className="text-gray-300 hover:text-white transition-colors duration-200">
            Strength
          </Link>
          <Link to="/privacy-score" className="text-gray-300 hover:text-white transition-colors duration-200 font-bold text-[var(--color-neon-blue)]">
            Privacy Score
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200">
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              {user.is_admin && (
                <Link to="/admin" className="text-[var(--color-neon-purple)] hover:text-white transition-colors duration-200">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors duration-200">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-200">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-transparent border border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] rounded hover:bg-[var(--color-neon-blue)] hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
