import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { AppRoutes } from '../routes';
import '../shared/design-system';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
