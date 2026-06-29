import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export const LogHours = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [formData, setFormData] = useState({
    date: today.toISOString().split('T')[0],
    hours: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/developer/hours?month=${selectedMonth}&year=${selectedYear}`);
      setLogs(res.data.data);
    } catch (err) {
      console.error("Error fetching hour logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedMonth, selectedYear]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!formData.date || !formData.hours || !formData.description) return;
    setIsSubmitting(true);
    try {
      await api.post('/developer/hours', formData);
      setFormData({
        ...formData,
        hours: '',
        description: ''
      });
      fetchLogs();
      setToast('Hours logged successfully.');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalLogged = logs.reduce((sum, log) => sum + (Number(log.hours) || 0), 0);
  const years = [today.getFullYear(), today.getFullYear() - 1, today.getFullYear() - 2];
  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-[360px_1fr] gap-6 items-start">
        
        {/* Left: Log Hours form card */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 sticky top-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Log Hours</h2>
          
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              max={today.toISOString().split('T')[0]}
              className="border border-gray-300 rounded-md text-sm px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
            />
          </div>
          
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Hours</label>
            <input 
              type="number" 
              name="hours" 
              value={formData.hours} 
              onChange={handleChange}
              min="0.5" max="10" step="0.5"
              className="border border-gray-300 rounded-md text-sm px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
            />
          </div>
          
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows={4}
              placeholder="What did you work on?"
              className="border border-gray-300 rounded-md text-sm px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
            />
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.date || !formData.hours || !formData.description}
            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-md disabled:opacity-70 transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Log Hours'}
          </button>

          {toast && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-md px-3 py-2 mt-3 text-center">
              {toast}
            </div>
          )}
        </div>

        {/* Right: Hour logs table card */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900">Hour Logs</h2>
            <div className="flex items-center gap-2">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 border-b border-[#F0F0F0]">Date</th>
                      <th className="text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 border-b border-[#F0F0F0]">Hours</th>
                      <th className="text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 border-b border-[#F0F0F0]">Task Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? logs.map(log => (
                      <tr key={log._id || log.id} className="border-b border-[#F0F0F0] hover:bg-[#F9FAFB] last:border-0">
                        <td className="py-3 text-gray-700">{log.date ? new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                        <td className="py-3 font-semibold text-gray-900">{log.hours}</td>
                        <td className="py-3 text-gray-600 max-w-xs truncate">{log.description}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="py-8 text-center text-gray-500">No hours logged in this period.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-[#E5E7EB] pt-4 mt-2 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Total logged: <span className="font-semibold text-gray-900 ml-1">{totalLogged} hrs</span>
                </div>
                <div className="text-sm text-gray-400">Target: 168 hrs/month</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
