import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Virtualization from '../pages/virtualization';
import { useState } from 'react';
import Playback from '../pages/playback';
import { RouterProvider } from 'react-router-dom';
import { router } from './routers/rootRouter';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}
