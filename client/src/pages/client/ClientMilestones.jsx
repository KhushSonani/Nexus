import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

export const ClientMilestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const res = await api.get('/client/milestones');
        
        // Sort order: pending + in-progress at top sorted by dueDate ascending, completed at bottom sorted by completedAt descending
        const data = res.data.data || [];
        const active = data.filter(m => m.status !== 'completed').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const completed = data.filter(m => m.status === 'completed').sort((a, b) => new Date(b.completedAt || b.dueDate) - new Date(a.completedAt || a.dueDate));
        
        setMilestones([...active, ...completed]);
      } catch (err) {
        console.error("Error fetching client milestones", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Project Milestones</h1>
      
      {milestones.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-sm">No milestones found for your project.</div>
      ) : (
        <div className="relative ml-4">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-[#E5E7EB]"></div>
          
          {milestones.map((m) => {
            let dotColor = 'bg-gray-300';
            if (m.status === 'completed') dotColor = 'bg-green-500';
            else if (m.status === 'in-progress') dotColor = 'bg-orange-500';
            else if (m.status === 'delayed') dotColor = 'bg-red-500';

            return (
              <div key={m._id || m.id} className="relative flex gap-5 pb-8 last:pb-0">
                <div className={`absolute -left-1 w-3 h-3 rounded-full border-2 border-white mt-1.5 ${dotColor}`}></div>
                
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex-1 ml-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-gray-900">{m.title}</h3>
                    <StatusBadge status={m.status} />
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {m.description}
                  </p>
                  
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span>Due: {m.dueDate ? new Date(m.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                    {m.status === 'completed' && (
                      <span className="text-green-600 font-medium">
                        Completed: {m.completedAt ? new Date(m.completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(m.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
