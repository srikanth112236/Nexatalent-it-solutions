import { ErrorBoundary } from '@nexatalent/shared';
import { RecruiterRoutes } from '../routes';

export function RecruiterApp() {
  return (
    <ErrorBoundary>
      <RecruiterRoutes />
    </ErrorBoundary>
  );
}
