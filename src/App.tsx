import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Virtualization from './Virtualization';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex justify-center items-center h-screen flex-col gap-4">
        <h1 className="font-bold text-3xl">Virtualization</h1>
        <Virtualization />
      </div>
    </QueryClientProvider>
  );
}
