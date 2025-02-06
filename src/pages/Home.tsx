import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <nav>
      <Link to="/react-hooks" style={linkStyle}>
        리액트 훅 사전
      </Link>
      <Link to="/optimization" style={linkStyle}>
        리액트 훅을 활용한 최적화 기법
      </Link>
      <Link to="/concurrent" style={linkStyle}>
        동시성 모드 페이지
      </Link>
    </nav>
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
