import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
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
