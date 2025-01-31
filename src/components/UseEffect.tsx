import { useEffect, useState } from 'react';

export default function UseEffect() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    console.log(count);
    window.addEventListener('click', increaseCount);

    return () => {
      console.log(`cleanup ${count}`);
      window.removeEventListener('click', increaseCount);
    };
  });

  return (
    <>
      <h1>useEffect Example</h1>
      <p>count: {count}</p>
      <p>화면을 클릭하여 숫자 세기</p>
    </>
  );
}
