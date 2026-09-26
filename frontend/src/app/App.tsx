import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { AppRoutes } from '../routes';
import { SmoothScrollProvider } from '../shared/motion/SmoothScrollProvider';
import '../shared/design-system';

export function App() {
  return (
    <ErrorBoundary>
      <SmoothScrollProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SmoothScrollProvider>
    </ErrorBoundary>
  );
}
