import axios from "axios";
import { useEffect, useState } from "react";

export function useFetch<T>(url: string, params?: unknown) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    axios
      .get(url, { params })
      .then((response) => {
        const results = response.data.results;
        setData(results);
        setLoading(false);
      })
      .catch((error: unknown) => {
        setError(error);
      });
  }, [url, params]);

  return { data, loading, error };
}
