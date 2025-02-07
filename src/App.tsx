import { lazy, Suspense } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import UseState from './components/react-hooks/UseState';
import UseReducer from './components/react-hooks/UseReducer';
import UseEffect from './components/react-hooks/UseEffect';
import UseLayoutEffect from './components/react-hooks/UseLayoutEffect';
import UseRef from './components/react-hooks/UseRef';
import UseContext from './components/react-hooks/UseContext';
import UseMemo from './components/react-hooks/UseMemo';
import Memo from './components/react-hooks/Memo';
import UseCallback from './components/react-hooks/UseCallback';
import UseFetch from './components/react-hooks/UseFetch';
import WrongMain from './pages/WrongMain';
import CorrectMain from './pages/CorrectMain';
import AutomaticBatching from './components/concurrent-mode/AutomaticBatching';
import ReactHooksPage from './pages/ReactHooksPage';
import Home from './pages/Home';
import ConcurrentPage from './pages/ConcurrentPage';
import OldRenderingProblem from './components/concurrent-mode/OldRenderingProblem';
import StartTransition from './components/concurrent-mode/StartTransition';
import UseTransition from './components/concurrent-mode/UseTransition';
import UseDeffredValue from './components/concurrent-mode/UseDeffredValue';
import OptimizationPage from './pages/OptimizationPage';
import Main from './pages/Main';

// const Home = lazy(() => import('./pages/Home'));
// const ReactHooksPage = lazy(() => import('./pages/ReactHooksPage'));
// const UseState = lazy(() => import('./components/react-hooks/UseState'));
// const UseReducer = lazy(() => import('./components/react-hooks/UseReducer'));
// const UseEffect = lazy(() => import('./components/react-hooks/UseEffect'));
// const UseLayoutEffect = lazy(
//   () => import('./components/react-hooks/UseLayoutEffect')
// );
// const UseRef = lazy(() => import('./components/react-hooks/UseRef'));
// const UseContext = lazy(() => import('./components/react-hooks/UseContext'));
// const UseMemo = lazy(() => import('./components/react-hooks/UseMemo'));
// const Memo = lazy(() => import('./components/react-hooks/Memo'));
// const UseCallback = lazy(() => import('./components/react-hooks/UseCallback'));
// const UseFetch = lazy(() => import('./components/react-hooks/UseFetch'));
// const WrongMain = lazy(() => import('./pages/WrongMain'));
// const CorrectMain = lazy(() => import('./pages/CorrectMain'));
// const AutomaticBatching = lazy(
//   () => import('./components/concurrent-mode/AutomaticBatching')
// );
// const ConcurrentPage = lazy(() => import('./pages/ConcurrentPage'));
// const OldRenderingProblem = lazy(
//   () => import('./components/concurrent-mode/OldRenderingProblem')
// );
// const StartTransition = lazy(
//   () => import('./components/concurrent-mode/StartTransition')
// );
// const UseTransition = lazy(
//   () => import('./components/concurrent-mode/UseTransition')
// );
// const UseDeffredValue = lazy(
//   () => import('./components/concurrent-mode/UseDeffredValue')
// );
// const OptimizationPage = lazy(() => import('./pages/OptimizationPage'));
// const Main = lazy(() => import('./pages/Main'));

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Suspense fallback={<div>loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/react-hooks" element={<ReactHooksPage />}>
              <Route
                path="use-state"
                element={
                  <Suspense fallback={<div>loading UseState...</div>}>
                    <UseState />
                  </Suspense>
                }
              />
              <Route path="use-reducer" element={<UseReducer />} />
              <Route path="use-effect" element={<UseEffect />} />
              <Route path="use-layout-effect" element={<UseLayoutEffect />} />
              <Route path="use-ref" element={<UseRef />} />
              <Route path="use-context" element={<UseContext />} />
              <Route path="use-memo" element={<UseMemo />} />
              <Route path="memo" element={<Memo />} />
              <Route path="use-callback" element={<UseCallback />} />
              <Route path="use-fetch" element={<UseFetch />} />
            </Route>

            <Route path="/optimization" element={<OptimizationPage />}>
              <Route path="wrong-main" element={<WrongMain />} />
              <Route path="main" element={<Main />} />
              <Route path="correct-main" element={<CorrectMain />} />
            </Route>

            <Route path="/concurrent" element={<ConcurrentPage />}>
              <Route
                path="old-rendering-problem"
                element={<OldRenderingProblem />}
              />
              <Route path="start-transition" element={<StartTransition />} />
              <Route path="use-transition" element={<UseTransition />} />
              <Route path="use-deffered-value" element={<UseDeffredValue />} />
              <Route path="auto-batching" element={<AutomaticBatching />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
