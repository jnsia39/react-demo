import { useEffect, useState } from 'react';

export default function UseState() {
  // const [count, setCount] = useState(0);

  // lazy initialization 적용 X
  // const [count, setCount] = useState(ExpensiveCalculation());

  // lazy initialization 적용 O
  const [count, setCount] = useState(() => ExpensiveCalculation());

  const resetCount = () => {
    setCount(0);
  };

  const increaseWrong = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const increaseCorrect = () => {
    setCount((preva) => preva + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    console.log('Component Rendering');
  });

  return (
    <>
      <h1 className="title">useState Example</h1>
      <p>count: {count}</p>
      <button onClick={resetCount}>0으로 값으로 변경</button>
      <button onClick={increaseWrong}>잘못된 숫자 세기</button>
      <button onClick={increaseCorrect}>올바른 숫자 세기</button>
    </>
  );
}

function ExpensiveCalculation() {
  console.log('무거운 연산 실행 중...');
  sleep(1000);
  return 1000;
}

// let resolved = false;

// function ExpensiveCalculation() {
//   console.log('무거운 연산 실행 중...');

//   if (!resolved) {
//     throw new Promise((resolve) => {
//       setTimeout(() => {
//         resolved = true;
//         resolve(1000);
//       }, 2000);
//     });
//   }
// }

function sleep(ms: number) {
  const start = Date.now() + ms;
  while (Date.now() < start) {
    console.log();
  }
}
