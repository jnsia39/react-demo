import { ROUTES } from '@shared/config/routes';
import Home from '@pages/Home';
import Playback from '@pages/playback';
import Virtualization from '@pages/virtualization';
import { createBrowserRouter } from 'react-router-dom';
import ExtractFrame from '@pages/extract-frame';

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
]);
