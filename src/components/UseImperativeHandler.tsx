import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

export default function UseImperativeHandler() {
  const inputRef = useRef();
  const [text, setText] = useState('');

  function handleClick(e) {
    inputRef.current.alert();
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input ref={inputRef} value={text} onChange={handleChange} />
      <button onClick={handleClick}>focus</button>
    </>
  );
}

const Input = forwardRef((props, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      alert: () => alert(props.value),
    }),
    [props.value]
  );

  return (
    <>
      <input ref={ref} {...props} type="text" />
    </>
  );
});
