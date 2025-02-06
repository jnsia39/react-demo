import { Link, Outlet } from 'react-router-dom';

export default function OptimizationPage() {
  return (
    <>
      <nav>
        <Link to="wrong-main" style={linkStyle}>
          최적화 되지 않는 코드
        </Link>
        <Link to="correct-main" style={linkStyle}>
          최적화가 어느 정도 완료된 코드
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
