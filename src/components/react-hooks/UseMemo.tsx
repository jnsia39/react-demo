import { useMemo, useState } from 'react';

export default function UseMemo() {
  const [number, setNumber] = useState(5);
  const [value, setValue] = useState(10);
  const [, triggerRendering] = useState(0);

  // const fact = factorial(number);
  const fact = useMemo(() => factorial(number), [number]);

  // const MemoizationComponent = <ExpensiveComponent value={value} />;

  const MemoizationComponent = useMemo(
    () => <ExpensiveComponent value={value} />,
    [value]
  );

  function handleClick() {
    triggerRendering((prev) => prev + 1);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(Number(e.target.value));
  }

  console.log('parent rendering!');

  return (
    <>
      <h1>useMemo Example</h1>
      <p>
        Factorial of {number} is: {fact}
      </p>
      <input value={value} onChange={handleChange} />
      <button onClick={handleClick}>렌더링 버튼</button>
      {MemoizationComponent}
    </>
  );
}

function ExpensiveComponent({ value }: { value: number }) {
  console.log('rendering!');

  return <p>{value + 1000}</p>;
}

function factorial(n: number): number {
  console.log(`Calculating factorial for ${n}`);
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
