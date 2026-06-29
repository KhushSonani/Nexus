import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export const Deliverables = () => {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const res = await api.get('/client/deliverables');
        setDeliverables(res.data.data);
      } catch (err) {
        console.error("Error fetching deliverables", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliverables();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Deliverables</h1>
      
      {deliverables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-sm font-medium text-gray-700">No deliverables yet.</h3>
          <p className="text-xs text-gray-400 mt-1">Your team will upload files here as the project progresses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {deliverables.map((d) => (
            <div key={d._id || d.id} className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
              <h3 className="text-sm font-semibold text-gray-900">{d.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{d.description}</p>
              <div className="text-xs text-gray-400">
                Uploaded: {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
              </div>
              <button 
                onClick={() => window.open(d.fileUrl, '_blank')}
                className="mt-auto w-full text-center text-sm font-medium text-orange-500 border border-orange-200 hover:bg-orange-50 py-2 rounded-md transition-colors"
              >
                View / Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
