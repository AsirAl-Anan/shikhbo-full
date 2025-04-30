import React from 'react';

import Sidebar from '../components/adminComponents/Sidebar';
import Header from '../components/adminComponents/Header';
import Dashboard from '../components/adminComponents/Dashboard';

const AdminPanel = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;