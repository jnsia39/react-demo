import { useEffect, useRef, useState } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default function UseRef() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(0);
  const previous = usePrevious(count);

  const handleClick = (): void => {
    inputRef.current?.focus();
  };

  const handleClick2 = (): void => {
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (inputRef.current) {
      console.log('Input element:', inputRef.current.value);
    }
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Enter text" />
      <button onClick={handleClick}>Focus the input</button>
      <button onClick={handleClick2}>count 증가</button>
      <div>
        <p>Current: {count}</p>
        <p>Previous: {previous}</p>
      </div>
    </div>
  );
}
