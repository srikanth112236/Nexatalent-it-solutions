import { Routes, Route } from 'react-router-dom';
import { NewHomePage } from '../pages/NewHomePage';
import { NewSolutionsPage } from '../pages/NewSolutionsPage';
import { NewIndustriesPage } from '../pages/NewIndustriesPage';
import { NewJobsPage } from '../pages/NewJobsPage';
import { NewInsightsPage } from '../pages/NewInsightsPage';
import { NewEmployersPage } from '../pages/NewEmployersPage';

/**
 * Mounted at /new/* in AppRoutes. Old /* WebsiteRoutes untouched —
 * /solutions, /industries, /jobs, /insights, /employers still serve old pages.
 */
export function WebsiteRoutesV2() {
  return (
    <Routes>
      <Route path="/" element={<NewHomePage />} />
      <Route path="/solutions" element={<NewSolutionsPage />} />
      <Route path="/industries" element={<NewIndustriesPage />} />
      <Route path="/jobs" element={<NewJobsPage />} />
      <Route path="/insights" element={<NewInsightsPage />} />
      <Route path="/employers" element={<NewEmployersPage />} />
    </Routes>
  );
}
