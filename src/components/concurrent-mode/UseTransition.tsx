import { memo, ReactNode, useState, useTransition } from 'react';

export default function UseTransition() {
  const [tab, setTab] = useState('about');
  const [isPending, startTransition] = useTransition();

  const changeTab = (tab: string) => {
    startTransition(() => {
      setTab(tab);
    });
  };

  return (
    <>
      <TabButton isActive={tab === 'about'} action={() => changeTab('about')}>
        About
      </TabButton>
      <TabButton isActive={tab === 'posts'} action={() => changeTab('posts')}>
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => changeTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
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

function AboutTab() {
  return <p>Welcome to my profile!</p>;
}

const PostsTab = memo(function PostsTab() {
  console.log('Rendering 5000 <SlowPost />');

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

function ContactTab() {
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
