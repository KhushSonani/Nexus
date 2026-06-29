import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const ProjectModal = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    client: project?.client?._id || project?.client || '',
    developer: project?.developer?._id || project?.developer || '',
    techStack: project?.techStack ? project.techStack.join(', ') : '',
    repoUrl: project?.repoUrl || '',
    status: project?.status || 'scoping',
    monthlyHoursTarget: project?.monthlyHoursTarget || 168,
    startDate: project?.startDate ? project.startDate.split('T')[0] : '',
    targetDate: project?.targetDate ? project.targetDate.split('T')[0] : ''
  });
  
  const [clients, setClients] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, devsRes] = await Promise.all([
          api.get('/admin/clients'),
          api.get('/admin/developers')
        ]);
        setClients(clientsRes.data);
        setDevelopers(devsRes.data);
      } catch (err) {}
    };
    fetchData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      if (project) {
        await api.put(`/admin/projects/${project._id || project.id}`, payload);
      } else {
        await api.post('/admin/projects', payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto py-10" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] w-full max-w-2xl p-6 relative my-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-base font-semibold text-gray-900 mb-6">{project ? 'Edit Project' : 'Add Project'}</h2>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Project Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>
        
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Client</label>
            <select name="client" value={formData.client} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full bg-white">
              <option value="">Select Client</option>
              {clients.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.company || c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Developer</label>
            <select name="developer" value={formData.developer} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full bg-white">
              <option value="">Select Developer</option>
              {developers.map(d => (
                <option key={d._id || d.id} value={d._id || d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Tech Stack (comma-separated)</label>
          <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Repo URL</label>
          <input type="text" name="repoUrl" value={formData.repoUrl} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full bg-white">
              <option value="scoping">scoping</option>
              <option value="in-progress">in-progress</option>
              <option value="completed">completed</option>
              <option value="on-hold">on-hold</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Monthly Hours Target</label>
            <input type="number" name="monthlyHoursTarget" value={formData.monthlyHoursTarget} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Target Date</label>
            <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#F0F0F0]">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md disabled:opacity-70">
            {isSubmitting ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [toast, setToast] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/projects');
      setProjects(res.data.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditProject(project);
    setIsModalOpen(true);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Projects</h1>
        <div className="flex items-center gap-4">
          {toast && <span className="text-sm text-green-600 font-medium">{toast}</span>}
          <button 
            onClick={openAddModal}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            Add Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="w-full bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                {['Project', 'Client', 'Developer', 'Tech Stack', 'Status', 'Target Date', 'Actions'].map((head) => (
                  <th key={head} className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id || project.id} className="border-b border-[#F0F0F0] hover:bg-[#F9FAFB] transition-colors last:border-0">
                  <td className="px-5 py-4 max-w-[200px]">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 truncate">{project.title}</span>
                      <span className="text-xs text-gray-400 truncate">{project.description}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{project.client?.company || project.client?.name || '-'}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{project.developer?.name || '-'}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {project.techStack?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-md font-medium">
                          {tech}
                        </span>
                      ))}
                      {project.techStack?.length > 3 && (
                        <span className="text-xs bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-md font-medium">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={project.status} /></td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {project.targetDate ? new Date(project.targetDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(project)} className="text-xs font-medium text-orange-500 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded-md">Edit</button>
                      <button className="text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-500 text-sm">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <ProjectModal 
          project={editProject} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProjects();
            showToast('Project saved successfully');
          }}
        />
      )}
    </div>
  );
};
