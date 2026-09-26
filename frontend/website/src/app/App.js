import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@nexatalent/shared';
import { AppRoutes } from '../routes';
import '../styles/tokens.css';
export function App() {
    return (_jsx(ErrorBoundary, { children: _jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) }) }));
}
//# sourceMappingURL=App.js.map