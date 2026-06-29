import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const routeToTitle = {
  '/client': 'Dashboard',
  '/client/project': 'My Project',
  '/client/milestones': 'Milestones',
  '/client/deliverables': 'Deliverables',
  '/client/queries': 'Support'
};

const ClientLayout = () => {
  const location = useLocation();
  const title = routeToTitle[location.pathname] || 'Client';

  return (
    <div className="flex h-screen w-full">
      <Sidebar role="client" />
      <div className="flex flex-col flex-1 overflow-hidden bg-[#F9FAFB] ml-[220px]">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
