import { ComponentType } from 'react';

// 고차 함수
function add(a: number) {
  return function (b: number) {
    return a + b;
  };
}

interface LoginProps {
  loginRequired?: boolean;
}

function withLoginComponent<T extends object>(Component: ComponentType<T>) {
  return function (props: T & LoginProps) {
    const { loginRequired, ...restProps } = props;

    if (loginRequired) {
      return <p>loginRequired</p>;
    }

    return <Component {...(restProps as T)} />;
  };
}

const Component = withLoginComponent((props: { value: string }) => {
  return <p>{props.value}</p>;
});

export default function HigherOrderComponent() {
  const result = add(5);
  const result2 = result(3);
  console.log(result2);

  return (
    <>
      <h1>HigherOrderComponent</h1>
      <Component value="hello" loginRequired={false} />
    </>
  );
}
