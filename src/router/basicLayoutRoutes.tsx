import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "../layout/BasicLayout";
import { ReactNode, Suspense } from "react";
import rootRoutes from "./rootRoutes";

const Loading: ReactNode = <div>Loading...</div>;

const basicLayoutRoutes = createBrowserRouter([
  {
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <BasicLayout />
      </Suspense>
    ),
    children: rootRoutes
  },
]);

export default basicLayoutRoutes