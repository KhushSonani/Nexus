import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = {
  admin: [
    { name: 'Dashboard', path: '/admin', icon: '🗂', exact: true },
    { name: 'Clients', path: '/admin/clients', icon: '👥' },
    { name: 'Developers', path: '/admin/developers', icon: '🧑‍💻' },
    { name: 'Projects', path: '/admin/projects', icon: '📁' },
    { name: 'Engagements', path: '/admin/engagements', icon: '🔗' },
    { name: 'Milestones', path: '/admin/milestones', icon: '🏁' },
    { name: 'Queries', path: '/admin/queries', icon: '💬' }
  ],
  client: [
    { name: 'Dashboard', path: '/client', icon: '🗂', exact: true },
    { name: 'My Project', path: '/client/project', icon: '📁' },
    { name: 'Milestones', path: '/client/milestones', icon: '🏁' },
    { name: 'Deliverables', path: '/client/deliverables', icon: '📦' },
    { name: 'Support', path: '/client/queries', icon: '💬' }
  ],
  developer: [
    { name: 'Dashboard', path: '/developer', icon: '🗂', exact: true },
    { name: 'Log Hours', path: '/developer/hours', icon: '⏱' },
    { name: 'My Tasks', path: '/developer/tasks', icon: '✅' }
  ]
};

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth();
  const items = NAV_ITEMS[role] || [];
  
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="fixed w-[220px] h-screen bg-white border-r border-[#F0F0F0] flex flex-col">
      {/* Logo Area */}
      <div className="px-5 py-5 border-b border-[#F0F0F0] flex items-center gap-3">
        <div className="bg-orange-500 rounded-md w-8 h-8 flex items-center justify-center text-white font-bold text-lg">
          N
        </div>
        <span className="text-base font-semibold text-gray-900">Nexus</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-l-4 border-orange-500 bg-[#FFF7ED] text-orange-600 font-semibold rounded-l-none'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Footer */}
      <div className="mt-auto border-t border-[#F0F0F0] px-4 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">
          {getInitials(user?.name)}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</span>
          <span className="text-xs text-gray-400 capitalize">{user?.role || role}</span>
          <button 
            onClick={logout}
            className="text-left text-xs text-gray-400 hover:text-red-500 mt-1 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
