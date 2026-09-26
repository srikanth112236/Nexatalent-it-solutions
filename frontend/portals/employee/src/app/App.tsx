import { ErrorBoundary } from '@nexatalent/shared';
import { EmployeeRoutes } from '../routes';

export function EmployeeApp() {
  return (
    <ErrorBoundary>
      <EmployeeRoutes />
    </ErrorBoundary>
  );
}
