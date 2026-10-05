import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { ScrollToTop } from '../shared/components/ScrollToTop';
import { ThemeProvider } from '../shared/theme/ThemeContext';
import { AppRoutes } from '../routes';
import { SmoothScrollProvider } from '../shared/motion/SmoothScrollProvider';
import '../shared/design-system';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SmoothScrollProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        </SmoothScrollProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
