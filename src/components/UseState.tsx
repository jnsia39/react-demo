import { useEffect, useState } from 'react';

export default function UseState() {
  const [count, setCount] = useState(0);

  const resetCount = () => {
    setCount(0);
  };

  const increaseWrong = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const increaseCorrect = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    console.log('Component Rendering');
  });

  return (
    <>
      <h1>useState Example</h1>
      <p>count: {count}</p>
      <button onClick={resetCount}>초기 값과 동일한 값으로 변경</button>
      <button onClick={increaseWrong}>잘못된 숫자 세기</button>
      <button onClick={increaseCorrect}>올바른 숫자 세기</button>
    </>
  );
}
