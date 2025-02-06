import { useEffect, useLayoutEffect, useState } from 'react';

export default function UseLayoutEffect() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    console.log(`effect ${count}`);
  }, [count]);

  useLayoutEffect(() => {
    console.log(`layout effect ${count}`);
    sleep(1000);
  }, [count]);

  return (
    <>
      <h1 className="title">useLayoutEffect Example</h1>
      <p>count: {count}</p>
      <button onClick={increaseCount}>숫자 세기</button>
    </>
  );
}

function sleep(ms: number) {
  const start = Date.now() + ms;
  while (Date.now() < start) {
    console.log();
  }
}
