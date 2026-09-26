import { ErrorBoundary } from '@nexatalent/shared';
import { SuperAdminRoutes } from '../routes';

export function SuperAdminApp() {
  return (
    <ErrorBoundary>
      <SuperAdminRoutes />
    </ErrorBoundary>
  );
}
