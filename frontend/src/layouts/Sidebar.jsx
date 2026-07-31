import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, X } from 'lucide-react';

const Sidebar = ({ menu, isOpen, setIsOpen }) => (
  <>
    {/* Mobile Backdrop overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
        onClick={() => setIsOpen(false)}
      />
    )}

    {/* Sidebar Content */}
    <aside className={`fixed md:sticky top-0 left-0 w-64 glass-panel rounded-none border-t-0 border-l-0 border-b-0 min-h-screen flex flex-col shadow-xl md:shadow-sm z-30 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/40">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-clinic-600 to-accent-500 shadow-md flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-clinic-900 tracking-tight">MediLab</span>
        </div>
        <button 
          className="md:hidden text-clinic-500 hover:text-clinic-800 p-1"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-clinic-600 text-white shadow-md shadow-clinic-200 -translate-y-0.5'
                  : 'text-clinic-500 hover:bg-white/60 hover:text-clinic-800'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);

export default Sidebar;
