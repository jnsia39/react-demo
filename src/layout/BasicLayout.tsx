import { Layout, Menu, MenuProps } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import { Content, Footer, Header } from 'antd/es/layout/layout'

const items = [
    {
        key: "/case/1",
        label: "Cases",
    },
    {
        key: '/',
        label: "Requests",
    },
    {
        key: '/discover',
        label: "Discover",
    }
]

export default function BasicLayout() {
    const navigate = useNavigate()

    const onClick: MenuProps['onClick'] = (e) => {
        navigate(e.key)
    };

    return (
        <Layout>
            <Header style={{ backgroundColor: 'white' }}>
                <Menu
                    mode="horizontal"
                    items={items}
                    onClick={onClick}
                />
            </Header>
            <Content style={{ padding: 24 }}>
                <Outlet />
            </Content>
            <Footer></Footer>
        </Layout>
    )
}
