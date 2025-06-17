import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Virtualization from './Virtualization';
import { useState } from 'react';

const queryClient = new QueryClient();

type Page = 'Virtualization' | 'Playback';

export default function App() {
  const [page, setPage] = useState<Page>('Virtualization');

  const changePage = () => {
    switch (page) {
      case 'Virtualization':
        setPage('Playback');
        break;
      case 'Playback':
        setPage('Virtualization');
        break;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex justify-center items-center h-screen flex-col gap-4">
        <h1 className="font-bold text-3xl" onClick={changePage}>
          {page}
        </h1>
        {page === 'Virtualization' && <Virtualization />}
        {page === 'Playback' && <Virtualization />}
      </div>
    </QueryClientProvider>
  );
}
