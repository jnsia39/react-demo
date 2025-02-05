import { memo, useCallback, useEffect, useState } from 'react';

interface ComponentProps {
  name: string;
  value: boolean;
  onChange: () => void;
}

export default function UseCallback() {
  const [status1, setStatus1] = useState(false);
  const [status2, setStatus2] = useState(false);

  // const toggle1 = () => {
  //   setStatus1(!status1);
  // };

  // const toggle2 = () => {
  //   setStatus2(!status2);
  // };

  const toggle1 = useCallback(() => {
    setStatus1(!status1);
  }, [status1]);

  const toggle2 = useCallback(() => {
    setStatus2(!status2);
  }, [status2]);

  return (
    <>
      <h1>useCallback Example</h1>
      <Component name="1" value={status1} onChange={toggle1} />
      <Component name="2" value={status2} onChange={toggle2} />
    </>
  );
}

const Component = memo(({ name, value, onChange }: ComponentProps) => {
  useEffect(() => {
    console.log(`Component ${name} rendering`);
  });

  return (
    <>
      <p>
        {name} {value ? '켜짐' : '꺼짐'}
      </p>
      <button onClick={onChange}>toggle</button>
    </>
  );
});
