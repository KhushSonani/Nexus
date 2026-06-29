import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const DeveloperModal = ({ developer, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: developer?.name || '',
    email: developer?.email || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (developer) {
        await api.put(`/admin/developers/${developer._id || developer.id}`, formData);
      } else {
        await api.post('/admin/developers', formData);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-base font-semibold text-gray-900 mb-6">{developer ? 'Edit Developer' : 'Add Developer'}</h2>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>
        
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full pr-10" 
              placeholder={developer ? "Leave blank to keep same" : ""}
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-xs text-gray-500 hover:text-gray-700 font-medium"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
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

export const ManageDevelopers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDeveloper, setEditDeveloper] = useState(null);
  const [toast, setToast] = useState('');

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/developers');
      setDevelopers(res.data.data);
    } catch (error) {
      console.error("Error fetching developers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const openAddModal = () => {
    setEditDeveloper(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dev) => {
    setEditDeveloper(dev);
    setIsModalOpen(true);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Developers</h1>
        <div className="flex items-center gap-4">
          {toast && <span className="text-sm text-green-600 font-medium">{toast}</span>}
          <button 
            onClick={openAddModal}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            Add Developer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {developers.map((dev) => (
            <div key={dev._id || dev.id} className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col items-center text-center gap-2 hover:shadow-sm transition-shadow">
              <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 text-lg font-bold flex items-center justify-center shrink-0">
                {dev.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
              </div>
              <div className="w-full mt-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{dev.name}</h3>
                <p className="text-xs text-gray-400 truncate">{dev.email}</p>
              </div>
              
              <div className="my-1">
                {dev.client ? (
                  <p className="text-xs text-gray-500">Assigned to: <span className="font-medium text-gray-700">{dev.client.company || dev.client.name}</span></p>
                ) : (
                  <p className="text-xs text-gray-400 italic">Unassigned</p>
                )}
              </div>
              
              <div className="mb-2">
                <StatusBadge status={dev.status || (dev.client ? 'active' : 'idle')} />
              </div>
              
              <button 
                onClick={() => openEditModal(dev)} 
                className="text-xs text-orange-500 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded-md w-full mt-auto"
              >
                Edit Developer
              </button>
            </div>
          ))}
          {developers.length === 0 && (
            <div className="col-span-3 text-center py-10 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
              No developers found.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <DeveloperModal 
          developer={editDeveloper} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchDevelopers();
            showToast('Developer saved successfully');
          }}
        />
      )}
    </div>
  );
};
