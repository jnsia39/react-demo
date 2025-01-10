import { Avatar, Badge, Flex, Image, Layout, Menu, MenuProps } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import {
  BellOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const items = [
  {
    key: '/case',
    label: 'Cases',
    children: [
      { key: '/case/1', label: 'Option 1' },
      { key: '/case/1', label: 'Option 3' },
    ],
  },
  {
    key: '/',
    label: 'Requests',
  },
  {
    key: '/discover',
    label: 'Discover',
  },
];

export default function BasicLayout() {
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          gap: 16,
          backgroundColor: 'white',
        }}
      >
        <Image
          src={
            'https://www.gmdsoft.com/wp-content/uploads/elementor/thumbs/GMDSOFT-Logo-Line-1-qms1ravc5ry0i6ifdetpxiho1249kx77lviabmi8zk.png'
          }
          alt="GMDSOFT"
          style={{ height: 24 }}
          preview={false}
          onClick={() => {
            navigate('/');
          }}
        />
        <Menu
          mode="horizontal"
          items={items}
          onClick={onClick}
          style={{ flex: 1 }}
        />
        <Flex align="center" gap={24}>
          <SearchOutlined style={{ fontSize: '20px' }} />
          <QuestionCircleOutlined style={{ fontSize: '20px' }} />
          <Badge count={4}>
            <BellOutlined style={{ fontSize: '20px' }} />
          </Badge>
          <Flex align="center" gap={8}>
            <Avatar
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
              style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}
            >
              yebali
            </Avatar>
            <h4>Kwon Yebali</h4>
          </Flex>
        </Flex>
      </Header>
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
      <Footer></Footer>
    </Layout>
  );
}
