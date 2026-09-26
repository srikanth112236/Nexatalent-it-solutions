import { Routes, Route } from 'react-router-dom';

function CandidateDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Candidate Portal</h1>
      <p>Profile, resume, applications, interview schedules, and job recommendations.</p>
    </div>
  );
}

export function CandidateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CandidateDashboard />} />
      <Route path="/candidate" element={<CandidateDashboard />} />
    </Routes>
  );
}
