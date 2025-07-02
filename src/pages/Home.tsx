import { ROUTES } from '@shared/config/routes';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const changePage = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4 bg-gray-50">
      <button
        className="bg-blue-500 text-white px-4 py-2 border hover:bg-blue-600 transition"
        onClick={() => changePage(ROUTES.VIRTUALIZATION)}
      >
        VIRTUALIZATION
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 border hover:bg-blue-600 transition"
        onClick={() => changePage(ROUTES.PLAYBACK)}
      >
        PLAYBACK
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 border hover:bg-blue-600 transition"
        onClick={() => changePage(ROUTES.FILE_UPLOAD)}
      >
        FILE_UPLOAD
      </button>
    </div>
  );
}
