import { useEffect, useState } from 'react';

export default function UseEffect() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('1');

  const increaseCount = () => {
    setCount((prev) => prev + 1);
  };

  const changeValue = () => {
    setValue('2');
  };

  useEffect(() => {
    console.log(`omission`);
    console.log(`effect ${count}`);
    window.addEventListener('click', increaseCount);

    // clean up function
    return () => {
      console.log(`cleanup ${count}`);
      window.removeEventListener('click', increaseCount);
    };
  });

  useEffect(() => {
    console.log('contained array');
  }, [value]);

  useEffect(() => {
    console.log('empty array');
  }, []);

  return (
    <>
      <h1 className="title">useEffect Example</h1>
      <p>count: {count}</p>
      <p>value: {value}</p>
      <p>화면을 클릭하여 숫자 세기</p>
      <button onClick={changeValue}>value 변경</button>
      <button onClick={increaseCount}>count 증가</button>
    </>
  );
}
