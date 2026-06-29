import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const routeToTitle = {
  '/admin': 'Dashboard',
  '/admin/clients': 'Manage Clients',
  '/admin/developers': 'Manage Developers',
  '/admin/projects': 'Manage Projects',
  '/admin/engagements': 'All Engagements',
  '/admin/milestones': 'Manage Milestones',
  '/admin/queries': 'Manage Queries'
};

const AdminLayout = () => {
  const location = useLocation();
  const title = routeToTitle[location.pathname] || 'Admin';

  return (
    <div className="flex h-screen w-full">
      <Sidebar role="admin" />
      <div className="flex flex-col flex-1 overflow-hidden bg-[#F9FAFB] ml-[220px]">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
