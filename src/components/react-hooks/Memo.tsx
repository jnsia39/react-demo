import { memo, useEffect, useState } from 'react';

export default function Memo() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <>
      <h1 className="title">memo Example</h1>
      <ParentComponent count={count} />
      <button onClick={increaseCount}>숫자 세기</button>
    </>
  );
}

function ParentComponent({ count }: { count: number }) {
  useEffect(() => {
    console.log('Parent Component Rendering');
  });

  return (
    <div>
      <ChildComponent /> {count}
    </div>
  );
}

const ChildComponent = memo(() => {
  useEffect(() => {
    console.log('Child Component Rendering');
  });

  return <span>count: </span>;
});

// function ChildComponent() {
//   useEffect(() => {
//     console.log('Child Component Rendering');
//   });

//   return <span>count: </span>;
// }
