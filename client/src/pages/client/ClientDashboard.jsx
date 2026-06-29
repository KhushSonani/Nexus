import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import HourProgressBar from '../../components/HourProgressBar';

export const ClientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/client/dashboard');
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching client dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!data) return <div>Failed to load data.</div>;

  const { client, project, hoursThisMonth, activeMilestones, recentDeliverables, openQueriesCount } = data;
  const developer = client?.assignedDeveloper;
  const hoursUsed = hoursThisMonth || 0;
  const hoursTarget = project?.monthlyHoursTarget || 168;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg px-6 py-5 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Welcome back, {client?.user?.name || client?.companyName || 'Client'}</h1>
          <p className="text-sm text-gray-400 mt-1">
            Your dedicated developer: <span className="font-medium text-gray-700">{developer?.name || 'Unassigned'}</span>
          </p>
        </div>
        {developer && (
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center">
            {developer.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* 4 metric cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 border-l-4 border-orange-500 flex flex-col justify-center">
          <div className="mb-2"><StatusBadge status={project?.status || 'idle'} /></div>
          <div className="text-sm text-gray-500">Current Status</div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 border-l-4 border-orange-500 flex flex-col justify-center">
          <div className="text-3xl font-bold text-gray-900">{hoursUsed} <span className="text-xl font-normal text-gray-400">/ {hoursTarget}</span></div>
          <div className="text-sm font-medium text-gray-900 mt-1">Hours Used</div>
          <div className="text-xs text-gray-400">monthly target</div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 border-l-4 border-orange-500 flex flex-col justify-center">
          <div className="text-3xl font-bold text-gray-900">{activeMilestones?.length || 0}</div>
          <div className="text-sm font-medium text-gray-900 mt-1">Active Milestones</div>
          <div className="text-xs text-gray-400">in progress</div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 border-l-4 border-orange-500 flex flex-col justify-center">
          <div className="text-3xl font-bold text-gray-900">{openQueriesCount || 0}</div>
          <div className="text-sm font-medium text-gray-900 mt-1">Open Queries</div>
          <div className="text-xs text-gray-400">awaiting response</div>
        </div>
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Hour Utilisation</h2>
          <HourProgressBar used={hoursUsed} target={hoursTarget} heightClass="h-3" />
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900">{hoursUsed} hrs</div>
            <div className="text-sm text-gray-400">of {hoursTarget} hrs this month</div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Milestones</h2>
            <Link to="/client/milestones" className="text-xs text-orange-500 hover:underline">View all</Link>
          </div>
          <div>
            {activeMilestones && activeMilestones.length > 0 ? activeMilestones.map((m) => (
              <div key={m._id || m.id} className="flex items-center gap-3 py-3 border-b border-[#F0F0F0] last:border-0">
                <div className={`w-2 h-2 rounded-full ${m.status === 'completed' ? 'bg-green-500' : m.status === 'in-progress' ? 'bg-orange-500' : m.status === 'delayed' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm font-medium text-gray-900">{m.title}</span>
                <span className="text-xs text-gray-400 ml-auto">{m.dueDate ? new Date(m.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                <StatusBadge status={m.status} />
              </div>
            )) : (
              <div className="text-sm text-gray-500 py-4 text-center">No upcoming milestones.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Deliverables */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4 border-b border-[#F0F0F0] pb-3">
          <h2 className="text-sm font-semibold text-gray-900">Recent Deliverables</h2>
          <Link to="/client/deliverables" className="text-xs text-orange-500 hover:underline">View all</Link>
        </div>
        <div>
          {recentDeliverables && recentDeliverables.length > 0 ? recentDeliverables.map((d) => (
            <div key={d._id || d.id} className="flex items-center justify-between py-3 border-b border-[#F0F0F0] last:border-0">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{d.title}</span>
                <span className="text-xs text-gray-400 max-w-lg truncate">{d.description}</span>
              </div>
              <button 
                onClick={() => window.open(d.fileUrl, '_blank')}
                className="text-xs text-orange-500 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded-md"
              >
                Open
              </button>
            </div>
          )) : (
            <div className="text-sm text-gray-500 py-4 text-center">No recent deliverables.</div>
          )}
        </div>
      </div>
    </div>
  );
};
