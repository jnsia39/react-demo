import { Link, Outlet } from 'react-router-dom';

export default function ReactHooksPage() {
  console.log('ReactHooksPage');

  return (
    <>
      <nav>
        <Link to="use-state" style={linkStyle}>
          useState
        </Link>
        <Link to="use-reducer" style={linkStyle}>
          useReducer
        </Link>
        <Link to="use-effect" style={linkStyle}>
          useEffect
        </Link>
        <Link to="use-layout-effect" style={linkStyle}>
          useLayoutEffect
        </Link>
        <Link to="use-ref" style={linkStyle}>
          useRef
        </Link>
        <Link to="use-context" style={linkStyle}>
          useContext
        </Link>
        <Link to="use-memo" style={linkStyle}>
          useMemo
        </Link>
        <Link to="memo" style={linkStyle}>
          memo
        </Link>
        <Link to="use-callback" style={linkStyle}>
          useCallback
        </Link>
        <Link to="use-fetch" style={linkStyle}>
          useFetch
        </Link>
        <Link to="" style={linkStyle}>
          Reset
        </Link>
      </nav>

      <Outlet />
    </>
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
