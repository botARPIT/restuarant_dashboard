import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Orders from '@/pages/Orders';

// Placeholder pages
const Menu = () => (
  <div>
    <h2>Menu Management</h2>
    <p>Menu management functionality coming soon...</p>
  </div>
);

const Analytics = () => (
  <div>
    <h2>Analytics</h2>
    <p>Advanced analytics dashboard coming soon...</p>
  </div>
);

const Settings = () => (
  <div>
    <h2>Settings</h2>
    <p>Settings and configuration coming soon...</p>
  </div>
);

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;