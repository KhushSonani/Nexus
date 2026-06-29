import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/developer/tasks');
      setTasks(res.data.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setSavingId(id);
    try {
      await api.put(`/developer/tasks/${id}`, { status: newStatus });
      setTasks(prev => prev.map(t => (t._id === id || t.id === id ? { ...t, status: newStatus } : t)));
      setSavedId(id);
      setTimeout(() => setSavedId(null), 1500);
    } catch (error) {
      console.error("Error updating task status", error);
    } finally {
      setSavingId(null);
    }
  };

  const pending = tasks.filter(t => !t.status || t.status === 'pending');
  const inProgress = tasks.filter(t => t.status === 'in-progress');
  const completed = tasks.filter(t => t.status === 'completed');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const renderColumn = (title, dotColor, items) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        <span className="ml-auto text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="text-xs text-gray-300 italic text-center py-8">No tasks here.</div>
      ) : (
        items.map(task => {
          const id = task._id || task.id;
          return (
            <div key={id} className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-sm transition-shadow">
              <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{task.description}</p>
              
              <div className="text-xs text-gray-400 mt-3">
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
              </div>
              
              <div className="mt-3 relative flex items-center">
                <select 
                  value={task.status || 'pending'} 
                  onChange={(e) => handleStatusChange(id, e.target.value)}
                  disabled={savingId === id}
                  className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#F9FAFB] appearance-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                {savedId === id && <span className="absolute -right-16 text-xs text-green-500">Updated</span>}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Tasks</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {renderColumn('Pending', 'bg-gray-400', pending)}
        {renderColumn('In Progress', 'bg-orange-500', inProgress)}
        {renderColumn('Completed', 'bg-green-500', completed)}
      </div>
    </div>
  );
};
