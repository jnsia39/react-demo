import { useReducer } from 'react';

interface State {
  count: number;
}

interface Action {
  type: 'up' | 'down' | 'reset';
  payload?: State;
}

const initialState: State = {
  count: 1,
};

function init(state: State): State {
  // 복잡한 연산
  state.count = 1;
  return state;
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'up':
      return { count: state.count + 1 };
    case 'down':
      return { count: state.count - 1 > 0 ? state.count - 1 : 0 };
    case 'reset':
      return { count: action.payload?.count || state.count };
    default:
      throw new Error(`Unexpected action type: ${action.type}`);
  }
}

export default function UseReducer() {
  const [state, dispatcher] = useReducer(reducer, initialState, init);

  function handleUpButtonClick() {
    dispatcher({ type: 'up' });
  }

  function handleDownButtonClick() {
    dispatcher({ type: 'down' });
  }

  function handleResetButtonClick() {
    dispatcher({ type: 'reset', payload: { count: 1 } });
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
