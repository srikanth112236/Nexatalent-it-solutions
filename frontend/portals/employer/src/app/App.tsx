import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { EmployerRoutes } from '../routes';

export function EmployerApp() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <EmployerRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
