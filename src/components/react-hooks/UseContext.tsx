import { createContext, useContext } from 'react';

const Context = createContext<{ something: string } | undefined>(undefined);

export default function UseContext() {
  return (
    <>
      <Context.Provider value={{ something: 'anything' }}>
        <Context.Provider value={{ something: 'something' }}>
          <A />
        </Context.Provider>
      </Context.Provider>
    </>
  );
}

function A() {
  return <B />;
}

function B() {
  return <C />;
}

function C() {
  return <D />;
}

function D() {
  const context = useContext(Context);

  return <p>{context ? context.something : ''}</p>;
}

// type Something = { something: string };

// export default function UseContext() {
//   return <A something={'something'} />;
// }

// function A({ something }: Something) {
//   return <B something={something} />;
// }

// function B({ something }: Something) {
//   return <C something={something} />;
// }

// function C({ something }: Something) {
//   return <D something={something} />;
// }

// function D({ something }: Something) {
//   return <p>{something}</p>;
// }
