import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StagePage from './pages/StagePage';
import BandsPage from './pages/BandsPage';
import CompetitionPage from './pages/CompetitionPage';
import WatchPage from './pages/WatchPage';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true,          element: <HomePage /> },
      { path: 'about',        element: <AboutPage /> },
      { path: 'stage',        element: <StagePage /> },
      { path: 'bands',        element: <BandsPage /> },
      { path: 'competition',  element: <CompetitionPage /> },
      { path: 'watch',        element: <WatchPage /> },
      { path: '*',            element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
