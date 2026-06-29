import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const ClientModal = ({ client, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    company: client?.company || '',
    industry: client?.industry || '',
    country: client?.country || '',
    timezone: client?.timezone || 'UTC',
    developer: client?.developer?._id || client?.developer || '',
    status: client?.status || 'trial'
  });
  const [developers, setDevelopers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDevs = async () => {
      try {
        const res = await api.get('/admin/developers');
        setDevelopers(res.data.data);
      } catch (err) {}
    };
    fetchDevs();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (client) {
        await api.put(`/admin/clients/${client._id || client.id}`, formData);
      } else {
        await api.post('/admin/clients', formData);
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
        <h2 className="text-base font-semibold text-gray-900 mb-6">{client ? 'Edit Client' : 'Add Client'}</h2>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Client Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>
        
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>
        
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Company Name</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Industry</label>
            <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Timezone</label>
            <select name="timezone" value={formData.timezone} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full bg-white">
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="PST">PST</option>
              <option value="GMT">GMT</option>
              <option value="IST">IST</option>
              <option value="SGT">SGT</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Engagement Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full bg-white">
              <option value="trial">trial</option>
              <option value="active">active</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Assign Developer</label>
          <select name="developer" value={formData.developer} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full bg-white">
            <option value="">Unassigned</option>
            {developers.map(dev => (
              <option key={dev._id || dev.id} value={dev._id || dev.id}>{dev.name}</option>
            ))}
          </select>
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

export const ManageClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [toast, setToast] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/clients');
      setClients(res.data.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openAddModal = () => {
    setEditClient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditClient(client);
    setIsModalOpen(true);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Clients</h1>
        <div className="flex items-center gap-4">
          {toast && <span className="text-sm text-green-600 font-medium">{toast}</span>}
          <button 
            onClick={openAddModal}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            Add Client
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
                {['Client', 'Company', 'Developer', 'Status', 'Monthly Rate', 'Actions'].map((head) => (
                  <th key={head} className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id || client.id} className="border-b border-[#F0F0F0] hover:bg-[#F9FAFB] transition-colors last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {client.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{client.name}</span>
                        <span className="text-xs text-gray-400">{client.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{client.company}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{client.developer?.name || 'Unassigned'}</td>
                  <td className="px-5 py-4"><StatusBadge status={client.status} /></td>
                  <td className="px-5 py-4 text-sm text-gray-700">{client.monthlyRate ? `$${client.monthlyRate.toLocaleString()}/mo` : '-'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(client)} className="text-xs font-medium text-orange-500 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded-md">Edit</button>
                      <button className="text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md">Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-500 text-sm">No clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <ClientModal 
          client={editClient} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchClients();
            showToast('Client saved successfully');
          }}
        />
      )}
    </div>
  );
};
