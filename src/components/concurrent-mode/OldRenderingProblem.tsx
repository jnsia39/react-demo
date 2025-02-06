import { useState } from 'react';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default function OldRenderingProblem() {
  const [input, setInput] = useState('');
  const [array, setArray] = useState([...Array(10000)]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    updateArray();
  };

  const updateArray = () =>
    setArray(
      array.map(() => ({
        text: 'component' + getRandomInt(0, 100),
        key: getRandomInt(0, 100),
      }))
    );

  // debounce 활용용
  // const updateArray = debounce(() => {
  //   setArray(
  //     array.map(() => ({
  //       text: 'component' + getRandomInt(0, 100),
  //       key: getRandomInt(0, 100),
  //     }))
  //   );
  // }, 300);

  // throttle 활용
  // const updateArray = throttle(() => {
  //   setArray(
  //     array.map(() => ({
  //       text: 'component' + getRandomInt(0, 100),
  //       key: getRandomInt(0, 100),
  //     }))
  //   );
  // }, 300);

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

// Debounce 함수: 일정 시간이 지나기 전에 다시 호출되면 기존 타이머를 취소하고 새 타이머를 설정
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  let timer: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

// Throttle 함수: 일정 시간 간격마다 한 번만 실행되도록 제한
export function throttle<T extends (...args: any[]) => void>(
  callback: T,
  limit: number
) {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      callback(...args);
    }
  };
}
