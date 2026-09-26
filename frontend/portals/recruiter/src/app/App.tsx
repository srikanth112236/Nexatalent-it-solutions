import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { RecruiterRoutes } from '../routes';

export function RecruiterApp() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RecruiterRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
