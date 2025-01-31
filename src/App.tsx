import './App.css';
import { RouterProvider } from 'react-router-dom';
import basicLayoutRoutes from './routers/basicLayoutRoutes';

export default function App() {
  return <RouterProvider router={basicLayoutRoutes} />;
}
