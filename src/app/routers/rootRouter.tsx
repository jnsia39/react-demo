import { ROUTES } from '@shared/config/routes';
import Home from '@pages/Home';
import Virtualization from '@pages/virtualization';
import { createBrowserRouter } from 'react-router-dom';
import FileUpload from '@pages/file-upload';
import Playback from '@pages/playback';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
    errorElement: <Home />,
  },
  {
    path: ROUTES.VIRTUALIZATION,
    element: <Virtualization />,
    errorElement: <Virtualization />,
  },
  {
    path: ROUTES.PLAYBACK,
    element: <Playback />,
    errorElement: <Playback />,
  },
  {
    path: ROUTES.FILE_UPLOAD,
    element: <FileUpload />,
    errorElement: <FileUpload />,
  },
  {
    path: '*',
    element: <Home />,
  },
]);
