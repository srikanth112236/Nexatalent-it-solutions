import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@nexatalent/shared';
import { AppRoutes } from '../routes';
import '../styles/tokens.css';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
