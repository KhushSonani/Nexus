import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import DeveloperLayout from './layouts/DeveloperLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import {
  AllEngagements,
  Unauthorized
} from './pages/Placeholders';
import { ManageClients } from './pages/admin/ManageClients';
import { ManageDevelopers } from './pages/admin/ManageDevelopers';
import { ManageProjects } from './pages/admin/ManageProjects';
import { ManageMilestones } from './pages/admin/ManageMilestones';
import { ManageQueries } from './pages/admin/ManageQueries';
import { ClientDashboard } from './pages/client/ClientDashboard';
import { MyProject } from './pages/client/MyProject';
import { ClientMilestones } from './pages/client/ClientMilestones';
import { Deliverables } from './pages/client/Deliverables';
import { ClientQueries } from './pages/client/ClientQueries';
import { DeveloperDashboard } from './pages/developer/DeveloperDashboard';
import { LogHours } from './pages/developer/LogHours';
import { MyTasks } from './pages/developer/MyTasks';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="clients" element={<ManageClients />} />
        <Route path="developers" element={<ManageDevelopers />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="engagements" element={<AllEngagements />} />
        <Route path="milestones" element={<ManageMilestones />} />
        <Route path="queries" element={<ManageQueries />} />
      </Route>

      <Route path="/client" element={<ProtectedRoute roles={['client']}><ClientLayout /></ProtectedRoute>}>
        <Route index element={<ClientDashboard />} />
        <Route path="project" element={<MyProject />} />
        <Route path="milestones" element={<ClientMilestones />} />
        <Route path="deliverables" element={<Deliverables />} />
        <Route path="queries" element={<ClientQueries />} />
      </Route>

      <Route path="/developer" element={<ProtectedRoute roles={['developer']}><DeveloperLayout /></ProtectedRoute>}>
        <Route index element={<DeveloperDashboard />} />
        <Route path="hours" element={<LogHours />} />
        <Route path="tasks" element={<MyTasks />} />
      </Route>
    </Routes>
  );
}

export default App;
