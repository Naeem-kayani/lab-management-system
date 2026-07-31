import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-xl font-bold text-clinic-900">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-clinic-800">{user?.name}</p>
          <p className="text-xs text-clinic-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-clinic-600 to-accent-500 shadow-md text-white flex items-center justify-center font-semibold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={handleLogout}
          className="text-clinic-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
