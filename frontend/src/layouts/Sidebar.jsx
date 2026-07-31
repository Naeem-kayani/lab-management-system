import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Sidebar = ({ menu }) => (
  <aside className="w-64 glass-panel rounded-none border-t-0 border-l-0 border-b-0 min-h-screen hidden md:flex flex-col shadow-sm relative z-20">
    <div className="flex items-center gap-2 px-6 py-6 border-b border-white/40">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-clinic-600 to-accent-500 shadow-md flex items-center justify-center">
        <Activity className="w-5 h-5 text-white" />
      </div>
      <span className="text-lg font-bold text-clinic-900 tracking-tight">MediLab</span>
    </div>
    <nav className="flex-1 px-3 py-6 space-y-1">
      {menu.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
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
);

export default Sidebar;
