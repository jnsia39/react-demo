import { Link, Outlet } from 'react-router-dom';

export default function ConcurrentPage() {
  return (
    <>
      <nav>
        <Link to="old-rendering-problem" style={linkStyle}>
          기존 렌더링
        </Link>
        <Link to="start-transition" style={linkStyle}>
          StartTransition
        </Link>
        <Link to="use-transition" style={linkStyle}>
          UseTransition
        </Link>
        <Link to="use-deffered-value" style={linkStyle}>
          UseDeffredValue
        </Link>
        <Link to="auto-batching" style={linkStyle}>
          AutomaticBatching
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
