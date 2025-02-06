import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AutomaticBatching() {
  const [count, setCount] = useState(0);

  const getUsersData = () => {
    const params = {
      results: 500,
      inc: 'name, email, phone, cell, picture',
      nat: 'US',
    };

    axios
      .get('https://randomuser.me/api/', { params })
      .then(() => {
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUsersData();
  }, []);

  useEffect(() => {
    console.log('Rendering!', count);
  });

  return <div>AutomaticBatching</div>;
}
