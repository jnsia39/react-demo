import { useState, useEffect } from 'react';

export default function UseFetch() {
  const { data, loading, error } = useFetch<{ title: string }>(
    'https://jsonplaceholder.typicode.com/todos/1'
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>useFetch Example</h1>
      <p>data: {data?.title}</p>
    </>
  );
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true; // 컴포넌트가 언마운트되었는지 확인하는 플래그

    setLoading(true);
    setError(null);

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setData(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false; // 언마운트 시 상태 업데이트 방지
    };
  }, [url]); // URL이 변경되면 다시 요청 보냄

  return { data, loading, error };
}
