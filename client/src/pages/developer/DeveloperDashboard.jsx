import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import HourProgressBar from '../../components/HourProgressBar';

export const DeveloperDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/developer/dashboard');
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching developer dashboard", err);
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

  const { developer, client, project, hoursLogged, hoursRemaining, upcomingMilestones, recentLogs } = data;
  const target = project?.monthlyHoursTarget || 168;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Assigned client card */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg px-6 py-5 flex items-center justify-between mb-6">
        <div>
          {client ? (
            <>
              <h1 className="text-lg font-semibold text-gray-900">{client.company || client.name}</h1>
              <p className="text-sm text-gray-400">{client.company ? client.name : client.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">Assigned: {developer?.createdAt ? new Date(developer.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</p>
            </>
          ) : (
            <h1 className="text-lg font-semibold text-gray-900">Unassigned</h1>
          )}
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={client ? 'active' : 'idle'} />
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center">
            {developer?.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* 3 metric cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 border-l-4 border-orange-500 flex flex-col justify-center">
          <div className="text-3xl font-bold text-gray-900">{hoursLogged || 0}</div>
          <div className="text-sm font-medium text-gray-900 mt-1">Hours Logged</div>
          <div className="text-xs text-gray-400">this month</div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 border-l-4 border-orange-500 flex flex-col justify-center">
          <div className="text-3xl font-bold text-gray-900">{Math.max(0, target - (hoursLogged || 0))}</div>
          <div className="text-sm font-medium text-gray-900 mt-1">Hours Remaining</div>
          <div className="text-xs text-gray-400">until monthly limit</div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 border-l-4 border-orange-500 flex flex-col justify-center">
          <div className="text-3xl font-bold text-gray-900">{upcomingMilestones || 0}</div>
          <div className="text-sm font-medium text-gray-900 mt-1">Upcoming Milestones</div>
          <div className="text-xs text-gray-400">due this month</div>
        </div>
      </div>

      {/* Hour Utilisation bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Hour Utilisation</h2>
        <p className="text-xs text-gray-400 mb-4">Your monthly hour utilisation</p>
        <HourProgressBar used={hoursLogged || 0} target={target} heightClass="h-4" />
        <div className="mt-4">
          <div className="text-2xl font-bold text-gray-900">{hoursLogged || 0} hrs</div>
          <div className="text-sm text-gray-400">of {target} hrs this month</div>
        </div>
      </div>

      {/* Recent Hour Logs */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent Logs</h2>
          <Link to="/developer/hours" className="text-xs text-orange-500 hover:underline">View all</Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {['Date', 'Hours', 'Task Description'].map((head) => (
                <th key={head} className="text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentLogs && recentLogs.length > 0 ? recentLogs.slice(0, 5).map((log) => (
              <tr key={log._id || log.id} className="border-t border-[#F0F0F0] hover:bg-[#F9FAFB]">
                <td className="py-3 text-sm text-gray-700">
                  {log.date ? new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                </td>
                <td className="py-3 font-semibold text-gray-900">{log.hours}</td>
                <td className="py-3 text-sm text-gray-700 max-w-md truncate">{log.description}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-500 text-sm border-t border-[#F0F0F0]">No recent logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
