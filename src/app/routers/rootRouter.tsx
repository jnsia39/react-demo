import { ROUTES } from '@shared/config/routes';
import Home from '@pages/Home';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
    errorElement: <Home />,
  },
]);
