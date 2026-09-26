import { ErrorBoundary } from '@nexatalent/shared';
import { CandidateRoutes } from '../routes';

export function CandidateApp() {
  return (
    <ErrorBoundary>
      <CandidateRoutes />
    </ErrorBoundary>
  );
}
