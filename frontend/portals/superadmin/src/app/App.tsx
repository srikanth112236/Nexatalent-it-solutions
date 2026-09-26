import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SuperAdminRoutes } from '../routes';

export function SuperAdminApp() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SuperAdminRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
