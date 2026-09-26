import { Routes, Route } from 'react-router-dom';

function EmployerDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Employer Portal</h1>
      <p>Company profile, hiring requirements, active jobs, candidate review, and interviews.</p>
    </div>
  );
}

export function EmployerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EmployerDashboard />} />
      <Route path="/employer" element={<EmployerDashboard />} />
    </Routes>
  );
}
