import React from 'react';
import ReactDOM from 'react-dom/client';
import { EmployeeApp } from './app/App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <EmployeeApp />
  </React.StrictMode>
);
