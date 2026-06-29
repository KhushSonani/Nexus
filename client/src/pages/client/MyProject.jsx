import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

export const MyProject = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get('/client/project');
        setProject(res.data.data);
      } catch (err) {
        console.error("Error fetching project details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No active project found</h2>
        <p className="text-sm text-gray-500">Please contact your administrator if this is an error.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">
      {/* Project header block */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
          <StatusBadge status={project.status} />
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed mt-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {project.techStack?.map((tech, i) => (
            <span key={i} className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-md font-medium">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-gray-400">Repository:</span>
          {project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline font-medium">
              {project.repoUrl}
            </a>
          ) : (
            <span className="text-gray-400 italic">Not shared yet</span>
          )}
        </div>
      </div>

      {/* Two-column info grid */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
          <div className="py-3 border-b border-[#F0F0F0] first:pt-0 last:border-0 last:pb-0">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Start Date</div>
            <div className="text-sm font-medium text-gray-900 mt-0.5">
              {project.startDate ? new Date(project.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
            </div>
          </div>
          <div className="py-3 border-b border-[#F0F0F0] first:pt-0 last:border-0 last:pb-0">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Target Date</div>
            <div className="text-sm font-medium text-gray-900 mt-0.5">
              {project.targetDate ? new Date(project.targetDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
            </div>
          </div>
          <div className="py-3 border-b border-[#F0F0F0] first:pt-0 last:border-0 last:pb-0">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Monthly Hours Target</div>
            <div className="text-sm font-medium text-gray-900 mt-0.5">{project.monthlyHoursTarget || 168} hrs</div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 text-lg font-bold flex items-center justify-center">
            {project.developer?.name ? project.developer.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
          </div>
          <h2 className="text-sm font-semibold text-gray-900 mt-3">{project.developer?.name || 'Unassigned'}</h2>
          <p className="text-xs text-gray-400">{project.developer?.email}</p>
          <span className="text-xs text-orange-500 font-medium mt-1 bg-orange-50 px-2 py-0.5 rounded-full">
            Your dedicated developer
          </span>
        </div>
      </div>
    </div>
  );
};
