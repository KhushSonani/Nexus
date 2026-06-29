import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

export const ClientQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/client/queries');
      setQueries(res.data.data);
    } catch (err) {
      console.error("Error fetching queries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post('/client/queries', formData);
      setFormData({ subject: '', message: '' });
      fetchQueries();
      setToast("Your query has been submitted. We'll respond shortly.");
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Raise a Query */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 mb-6 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Raise a Query</h2>
        
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <input 
            type="text" 
            name="subject" 
            value={formData.subject} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-md text-sm px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
          />
        </div>
        
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Message</label>
          <textarea 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            rows={4} 
            className="border border-gray-300 rounded-md text-sm px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
          />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !formData.subject.trim() || !formData.message.trim()} 
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-md disabled:opacity-70 transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Query'}
        </button>

        {toast && (
          <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-md px-4 py-3 mt-3">
            {toast}
          </div>
        )}
      </div>

      {/* My Queries */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">My Queries</h2>
        {queries.length === 0 ? (
          <div className="text-sm text-gray-400 italic text-center py-8">No queries raised yet.</div>
        ) : (
          queries.map((q) => (
            <div key={q._id || q.id} className="bg-white border border-[#E5E7EB] rounded-lg p-5 mb-3">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-gray-900">{q.subject}</h3>
                <StatusBadge status={q.status || 'open'} />
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">{q.message}</p>
              <div className="text-xs text-gray-400 mt-2">
                {q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
              </div>
              
              {q.adminReply && (
                <div className="mt-4 bg-orange-50 border border-orange-100 rounded-md px-4 py-3">
                  <div className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">Team Response</div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{q.adminReply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
