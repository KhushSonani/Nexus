import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const ReplyModal = ({ query, onClose, onSuccess }) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.put(`/admin/queries/${query._id || query.id}/reply`, { reply: replyText });
      onSuccess();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 py-10" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-base font-semibold text-gray-900 mb-6">Reply to Query</h2>

        <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4 border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{query.client?.name || 'Unknown'}</span>
              <span className="text-xs text-gray-400">{query.client?.email || ''}</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-1">Original Message</p>
          <p className="text-sm text-gray-700 leading-relaxed">{query.subject || query.text || 'No content provided.'}</p>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1">Admin Reply</label>
          <textarea 
            rows={4} 
            value={replyText} 
            onChange={(e) => setReplyText(e.target.value)} 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full" 
            placeholder="Type your reply here..."
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#F0F0F0]">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting || !replyText.trim()} className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md disabled:opacity-70">
            {isSubmitting ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ManageQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState(null);
  const [toast, setToast] = useState('');

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/queries');
      setQueries(res.data.data);
    } catch (error) {
      console.error("Error fetching queries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const openReplyModal = (q) => {
    setActiveQuery(q);
    setIsModalOpen(true);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Queries</h1>
        <div className="flex items-center gap-4">
          {toast && <span className="text-sm text-green-600 font-medium transition-opacity">{toast}</span>}
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
                {['Client', 'Subject', 'Status', 'Date Submitted', 'Actions'].map((head) => (
                  <th key={head} className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queries.map((q) => (
                <tr key={q._id || q.id} className="border-b border-[#F0F0F0] hover:bg-[#F9FAFB] transition-colors last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {q.client?.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{q.client?.name || 'Unknown'}</span>
                        <span className="text-xs text-gray-400">{q.client?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-gray-700 max-w-[240px] truncate">{q.subject}</div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={q.status || 'open'} /></td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <button 
                      onClick={() => openReplyModal(q)} 
                      className="text-xs font-medium text-orange-500 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded-md"
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
              {queries.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500 text-sm">No queries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && activeQuery && (
        <ReplyModal 
          query={activeQuery} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchQueries();
            showToast('Reply sent');
          }}
        />
      )}
    </div>
  );
};
