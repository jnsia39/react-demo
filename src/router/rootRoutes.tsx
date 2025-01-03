import { ComponentType, lazy, ReactNode, Suspense } from "react";
import rootChild from "./case/caseRoutes";

const Loading: ReactNode = <div>Loading...</div>;

const Home: ComponentType = lazy(() => import("../page/Home"));
const Case: ComponentType = lazy(() => import("../page/Case"));

const rootRoutes = [{
    path: "",
    element: (
        <Suspense fallback={Loading}>
            <Home />
        </Suspense>
    ),
},
{
    path: "case/:id",
    element: (
        <Suspense fallback={Loading}>
            <Case />
        </Suspense>
    ),
    children: rootChild
}]

export default rootRoutes