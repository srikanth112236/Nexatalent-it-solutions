import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CandidateRoutes } from '../routes';

export function CandidateApp() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CandidateRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
