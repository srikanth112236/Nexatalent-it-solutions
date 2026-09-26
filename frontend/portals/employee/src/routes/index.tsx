import { Routes, Route } from 'react-router-dom';

function EmployeeDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Employee Portal</h1>
      <p>Operations, CRM, targets, tasks, and recruitment support.</p>
    </div>
  );
}

export function EmployeeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EmployeeDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
    </Routes>
  );
}
