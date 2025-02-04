import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  ChangeEvent,
} from 'react';

interface InputHandle {
  alert: () => void;
}

interface InputProps {
  parentRef: React.RefObject<InputHandle>;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function UseImperativeHandler() {
  const inputRef = useRef<InputHandle>(null);
  const [text, setText] = useState('');

  function handleClick() {
    inputRef.current?.alert();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  return (
    <>
      {/* <Input ref={inputRef} value={text} onChange={handleChange} /> */}
      <Input parentRef={inputRef} value={text} onChange={handleChange} />
      <button onClick={handleClick}>click me!</button>
    </>
  );
}

// const Input = forwardRef<InputHandle, InputProps>((props, ref) => {
//   useImperativeHandle(
//     ref,
//     () => ({
//       alert: () => alert(props.value),
//     }),
//     [props.value]
//   );

//   return (
//     <>
//       <input {...props} type="text" />
//     </>
//   );
// });

function Input({ parentRef, value }: InputProps) {
  useImperativeHandle(
    parentRef,
    () => ({
      alert: () => alert(value),
    }),
    [value]
  );

  return (
    <>
      <input value={value} type="text" />
    </>
  );
}
