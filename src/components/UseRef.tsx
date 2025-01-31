import { useEffect, useRef } from 'react';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default function UseRef() {
  const inputRef = useRef();

  console.log(inputRef.current);

  function handleClick() {
    inputRef.current.focus();
  }

  useEffect(() => {
    console.log(inputRef.current);
  }, [inputRef]);

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
