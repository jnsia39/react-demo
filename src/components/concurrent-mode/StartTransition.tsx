import React, { startTransition, useState } from 'react';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default function StartTransition() {
  const [input, setInput] = useState('');
  const [array, setArray] = useState([...Array(10000)]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    // 우선순위 낮추기
    updateArray();
  };

  const updateArray = () =>
    // startTransition(() =>
    setArray(
      array.map(() => ({
        text: 'component' + getRandomInt(0, 100),
        key: getRandomInt(0, 100),
      }))
      //   )
    );

  return (
    <div>
      <input
        placeholder="아무 값이나 입력해보세요!"
        value={input}
        onChange={handleChange}
      />
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          color: '#111111',
        }}
      >
        {array.map(
          (item, index) =>
            item && (
              <div key={index} data-key={item.key}>
                <div>{item.text}</div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
