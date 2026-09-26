import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@nexatalent/shared';
import { AuthRoutes } from '../routes';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
