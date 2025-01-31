import { useReducer } from 'react';

interface State {
  count: number;
}

interface Action {
  type: 'up' | 'down' | 'reset';
  payload?: State;
}

const initialState: State = {
  count: 0,
};

function init(count: State): State {
  // 복잡한 연산
  return count;
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'up':
      return { count: state.count + 1 };
    case 'down':
      return { count: state.count - 1 > 0 ? state.count - 1 : 0 };
    case 'reset':
      return { count: action.payload?.count || 0 };
    default:
      throw new Error(`Unexpected action type: ${action.type}`);
  }
}

export default function UseReducer() {
  const [state, dispacher] = useReducer(reducer, initialState, init);

  function handleUpButtonClick() {
    dispacher({ type: 'up' });
  }

  function handleDownButtonClick() {
    dispacher({ type: 'down' });
  }

  function handleResetButtonClick() {
    dispacher({ type: 'reset', payload: { count: 0 } });
  }

  return (
    <>
      <h1>useReducer Example</h1>
      <p>count: {state.count}</p>
      <button onClick={handleUpButtonClick}>Up</button>
      <button onClick={handleDownButtonClick}>Down</button>
      <button onClick={handleResetButtonClick}>Reset</button>
    </>
  );
}
