import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-clinic-600 p-1 hover:bg-clinic-100 rounded-md"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-clinic-900 truncate max-w-[200px] sm:max-w-none">{title}</h1>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-clinic-800">{user?.name}</p>
          <p className="text-xs text-clinic-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-clinic-600 to-accent-500 shadow-md text-white flex items-center justify-center font-semibold text-sm shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={handleLogout}
          className="text-clinic-400 hover:text-red-500 transition-colors shrink-0"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
