import React from 'react';

const Placeholder = ({ name }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
    <p className="text-sm text-gray-500 mt-2">This is a placeholder page.</p>
  </div>
);

export const AdminDashboard = () => <Placeholder name="Admin Dashboard" />;
export const AllEngagements = () => <Placeholder name="All Engagements" />;



export const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-500">You do not have permission to view this page.</p>
    </div>
  </div>
);
