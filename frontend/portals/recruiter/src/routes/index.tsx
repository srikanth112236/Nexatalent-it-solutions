import { Routes, Route } from 'react-router-dom';

function RecruiterDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Recruiter Workspace</h1>
      <p>Sourcing, ATS pipeline, candidate management, and interviews.</p>
    </div>
  );
}

export function RecruiterRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RecruiterDashboard />} />
      <Route path="/recruiter" element={<RecruiterDashboard />} />
    </Routes>
  );
}
