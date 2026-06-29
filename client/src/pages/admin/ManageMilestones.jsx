import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const MilestoneModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    dueDate: '',
    notifyClient: true
  });
  const [projects, setProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/admin/projects');
        setProjects(res.data.data);
      } catch (err) {}
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/admin/milestones', formData);
      onSuccess();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 py-10" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-base font-semibold text-gray-900 mb-6">Add Milestone</h2>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>
        
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Project</label>
          <select name="project" value={formData.project} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full bg-white">
            <option value="">Select Project</option>
            {projects.map(p => (
              <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" name="notifyClient" checked={formData.notifyClient} onChange={handleChange} id="notifyClient" className="w-4 h-4 accent-orange-500 rounded border-gray-300" />
          <label htmlFor="notifyClient" className="text-sm text-gray-700">Notify Client</label>
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

export const ManageMilestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [savedRowId, setSavedRowId] = useState(null);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/milestones');
      setMilestones(res.data.data);
    } catch (error) {
      console.error("Error fetching milestones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/milestones/${id}`, { status: newStatus });
      setMilestones(prev => prev.map(m => m._id === id || m.id === id ? { ...m, status: newStatus } : m));
      setSavedRowId(id);
      setTimeout(() => setSavedRowId(null), 1500);
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Milestones</h1>
        <div className="flex items-center gap-4">
          {toast && <span className="text-sm text-green-600 font-medium">{toast}</span>}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            Add Milestone
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
                {['Milestone', 'Project', 'Due Date', 'Status', 'Actions'].map((head) => (
                  <th key={head} className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => {
                const id = m._id || m.id;
                return (
                  <tr key={id} className="border-b border-[#F0F0F0] hover:bg-[#F9FAFB] transition-colors last:border-0">
                    <td className="px-5 py-4 max-w-[250px]">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 truncate">{m.title}</span>
                        <span className="text-xs text-gray-400 truncate">{m.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{m.project?.title || '-'}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select 
                          value={m.status || 'pending'} 
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                        >
                          <option value="pending">pending</option>
                          <option value="in-progress">in-progress</option>
                          <option value="completed">completed</option>
                        </select>
                        {savedRowId === id && <span className="text-xs text-green-500 transition-opacity">Saved</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="text-xs font-medium text-orange-500 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded-md">Edit</button>
                        <button className="text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {milestones.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500 text-sm">No milestones found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <MilestoneModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchMilestones();
            showToast('Milestone saved successfully');
          }}
        />
      )}
    </div>
  );
};
