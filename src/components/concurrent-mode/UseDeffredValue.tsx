import { memo, ReactNode, useDeferredValue, useState } from 'react';

export default function UseDeffredValue() {
  const [tab, setTab] = useState('about');
  const defferedTab = useDeferredValue(tab);

  return (
    <>
      <TabButton isActive={tab === 'about'} action={() => setTab('about')}>
        About
      </TabButton>
      <TabButton isActive={tab === 'posts'} action={() => setTab('posts')}>
        Posts (slow)
      </TabButton>
      <TabButton isActive={tab === 'contact'} action={() => setTab('contact')}>
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <About />}
      {defferedTab === 'posts' && <Posts />}
      {tab === 'contact' && <Contact />}
    </>
  );
}

function TabButton({
  action,
  children,
  isActive,
}: {
  action: () => void;
  children: ReactNode;
  isActive: boolean;
}) {
  if (isActive) {
    return <b>{children}</b>;
  }

  return (
    <button
      onClick={() => {
        action();
      }}
    >
      {children}
    </button>
  );
}

const Posts = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 5000 <SlowPost />');

  let items = [];
  for (let i = 0; i < 5000; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }

  return <ul className="items">{items}</ul>;
});

function SlowPost({ index }: { index: number }) {
  let startTime = performance.now();

  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return <li className="item">Post #{index + 1}</li>;
}

function About() {
  return <p>Welcome to my profile!</p>;
}

function Contact() {
  return (
    <>
      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
