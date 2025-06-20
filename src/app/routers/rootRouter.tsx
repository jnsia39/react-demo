import { ROUTES } from '@shared/config/routes';
import Home from '@pages/Home';
import Playback from '@pages/playback';
import Virtualization from '@pages/virtualization';
import { createBrowserRouter } from 'react-router-dom';
import ExtractFrame from '@pages/extract-frame';
import VideoAreaSelector from '@pages/video-area-select';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.VIRTUALIZATION,
    element: <Virtualization />,
  },
  {
    path: ROUTES.PLAYBACK,
    element: <Playback />,
  },
  {
    path: ROUTES.EXTRACT_FRAME,
    element: <ExtractFrame />,
  },
  {
    path: ROUTES.VIDEO_AREA_SELECT,
    element: <VideoAreaSelector />,
  },
]);
