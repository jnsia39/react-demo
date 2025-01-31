import { createBrowserRouter } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import rootRoutes from './rootRoutes';

const basicLayoutRoutes = createBrowserRouter([
  {
    path: '',
    element: <BasicLayout />,
    children: rootRoutes,
  },
]);

export default basicLayoutRoutes;
