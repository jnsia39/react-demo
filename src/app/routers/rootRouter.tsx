import { ROUTES } from '@shared/config/routes';
import Home from '@pages/Home';
import Playback from '@pages/playback';
import Virtualization from '@pages/virtualization';
import { createBrowserRouter } from 'react-router-dom';
import ExtractFrame from '@pages/extract-frame';
import VideoAreaSelector from '@pages/video-area-select';
import FileUpload from '@pages/file-upload';

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
    path: ROUTES.EXTRACT_FRAME,
    element: <ExtractFrame />,
    errorElement: <ExtractFrame />,
  },
  {
    path: ROUTES.VIDEO_AREA_SELECT,
    element: <VideoAreaSelector />,
    errorElement: <VideoAreaSelector />,
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
