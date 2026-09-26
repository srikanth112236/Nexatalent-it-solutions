import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { EmployeeRoutes } from '../routes';

export function EmployeeApp() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <EmployeeRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
