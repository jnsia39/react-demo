import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

function useFetch<T>(url: string, params: unknown) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    axios
      .get(url, { params })
      .then((response: AxiosResponse) => {
        const results = response.data.results;
        setData(results);
        setLoading(false);
      })
      .catch((error: unknown) => {
        setError(error);
      });
  }, [url]);

  return { data, loading, error };
}
