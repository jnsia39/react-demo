import { ComponentType, lazy, ReactNode, Suspense } from 'react';

const Loading: ReactNode = <div>Loading...</div>;

const Home: ComponentType = lazy(() => import('../pages/Home'));

const rootRoutes = [
  {
    path: '',
    element: (
      <Suspense fallback={Loading}>
        <Home />
      </Suspense>
    ),
  },
];

export default rootRoutes;
