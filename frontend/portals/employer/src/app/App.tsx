import { ErrorBoundary } from '@nexatalent/shared';
import { EmployerRoutes } from '../routes';

export function EmployerApp() {
  return (
    <ErrorBoundary>
      <EmployerRoutes />
    </ErrorBoundary>
  );
}
