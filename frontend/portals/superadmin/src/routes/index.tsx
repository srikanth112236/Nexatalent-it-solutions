import { Routes, Route } from 'react-router-dom';

function SuperAdminDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Super Admin Console</h1>
      <p>Platform governance, multi-tenancy, audit logs, and configuration.</p>
    </div>
  );
}

export function SuperAdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminDashboard />} />
      <Route path="/superadmin" element={<SuperAdminDashboard />} />
    </Routes>
  );
}
