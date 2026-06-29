import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import HourProgressBar from '../../components/HourProgressBar';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        {error}
      </div>
    );
  }

  // Derive counts from data
  const clientsOnTrial = data.clients?.filter(c => c.status === 'trial').length || 0;
  // Fallback values if API doesn't return exact subtext info
  const projectsInReview = 0; // Data might not have project statuses directly without mapping clients
  
  return (
    <div className="flex flex-col w-full h-full">
      {/* Top Section - Stat Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col gap-1 border-l-4 border-l-orange-500">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Clients</span>
          <span className="text-3xl font-bold text-gray-900 mt-1">{data.totalClients || 0}</span>
          <span className="text-xs text-gray-400 mt-0.5">{clientsOnTrial} on trial</span>
        </div>
        
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col gap-1 border-l-4 border-l-orange-500">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Active Projects</span>
          <span className="text-3xl font-bold text-gray-900 mt-1">{data.activeProjects || 0}</span>
          <span className="text-xs text-gray-400 mt-0.5">{projectsInReview} in review</span>
        </div>
        
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col gap-1 border-l-4 border-l-orange-500">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Developers</span>
          <span className="text-3xl font-bold text-gray-900 mt-1">{data.totalDevelopers || 0}</span>
          <span className="text-xs text-gray-400 mt-0.5">All assigned</span>
        </div>
        
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col gap-1 border-l-4 border-l-orange-500">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Hours This Month</span>
          <span className="text-3xl font-bold text-gray-900 mt-1">{data.totalHoursLogged || 0}</span>
          <span className="text-xs text-gray-400 mt-0.5">Across all projects</span>
        </div>
      </div>

      {/* Bottom Section - Lists */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Left Card: Active Engagements */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Active Engagements</h2>
            <Link to="/admin/engagements" className="text-xs text-orange-500 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="flex flex-col">
            {data.clients && data.clients.length > 0 ? (
              data.clients.map(client => {
                const devName = client.assignedDeveloper?.name || 'Unassigned';
                const projectName = client.project?.title || 'No Project';
                const status = client.status;
                const initials = client.companyName?.substring(0, 2).toUpperCase() || 'C';
                
                return (
                  <div key={client._id} className="flex items-center gap-3 py-3 border-b border-[#F0F0F0] last:border-0">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col flex-1 truncate">
                      <span className="text-sm font-medium text-gray-900 truncate">{client.companyName}</span>
                      <span className="text-xs text-gray-400 truncate">{devName}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-w-[120px]">
                      <HourProgressBar used={client.hoursLogged || 0} target={client.project?.monthlyHoursTarget || 168} />
                      <div className="mt-1">
                        <StatusBadge status={status} />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="text-sm text-gray-500 py-3">No active engagements found.</span>
            )}
          </div>
        </div>

        {/* Right Card: Recent Milestones */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Milestones</h2>
            <Link to="/admin/milestones" className="text-xs text-orange-500 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="flex flex-col">
            {data.recentMilestones && data.recentMilestones.length > 0 ? (
              data.recentMilestones.map(milestone => {
                let dotColor = 'bg-gray-300';
                if (milestone.status === 'completed') dotColor = 'bg-green-500';
                else if (milestone.status === 'in-progress') dotColor = 'bg-orange-500';
                
                const dueDate = new Date(milestone.targetDate || milestone.dueDate).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                });
                
                return (
                  <div key={milestone._id} className="flex items-center gap-3 py-3 border-b border-[#F0F0F0] last:border-0">
                    <div className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                    <div className="flex flex-col flex-1 truncate">
                      <span className="text-sm font-medium text-gray-900 truncate">{milestone.title}</span>
                      <span className="text-xs text-gray-400 truncate">{milestone.project?.title || 'Unknown Project'}</span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {dueDate !== 'Invalid Date' ? dueDate : '-'}
                    </span>
                  </div>
                );
              })
            ) : (
              <span className="text-sm text-gray-500 py-3">No recent milestones found.</span>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
