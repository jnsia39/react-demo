import { Route, Link, BrowserRouter, Routes } from 'react-router-dom';
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
import HigherOrderComponent from './components/HigherOrderComponent';

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/use-state" style={linkStyle}>
            useState
          </Link>
          <Link to="/use-reducer" style={linkStyle}>
            useReducer
          </Link>
          <Link to="/use-effect" style={linkStyle}>
            useEffect
          </Link>
          <Link to="/use-layout-effect" style={linkStyle}>
            useLayoutEffect
          </Link>
          <Link to="/use-ref" style={linkStyle}>
            useRef
          </Link>
          <Link to="/use-context" style={linkStyle}>
            useContext
          </Link>
          <Link to="/use-memo" style={linkStyle}>
            useMemo
          </Link>
          <Link to="/memo" style={linkStyle}>
            memo
          </Link>
          <Link to="/use-callback" style={linkStyle}>
            useCallback
          </Link>
          <Link to="/use-fetch" style={linkStyle}>
            useFetch
          </Link>
          <Link to="/higher-order-component" style={linkStyle}>
            HigherOrderComponent
          </Link>
          <Link to="/" style={linkStyle}>
            Reset
          </Link>
        </nav>

        {/* 각 페이지의 Route 설정 */}
        <Routes>
          <Route path="/" />
          <Route path="/use-state" element={<UseState />} />
          <Route path="/use-reducer" element={<UseReducer />} />
          <Route path="/use-effect" element={<UseEffect />} />
          <Route path="/use-layout-effect" element={<UseLayoutEffect />} />
          <Route path="/use-ref" element={<UseRef />} />
          <Route path="/use-context" element={<UseContext />} />
          <Route path="/use-memo" element={<UseMemo />} />
          <Route path="/memo" element={<Memo />} />
          <Route path="/use-callback" element={<UseCallback />} />
          <Route path="/use-fetch" element={<UseFetch />} />
          <Route
            path="/higher-order-component"
            element={<HigherOrderComponent />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: 'white',
  display: 'block',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: 16,
};
