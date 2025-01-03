import { green } from '@ant-design/colors';
import { Breadcrumb, Flex, Image, Progress, Tabs, TabsProps } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom';

const caseDetail = {
    title: "CSE-23-0025",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia quidem in optio ab quam neque quia perferendis similique labore cum vel exercitationem, recusandae deleniti eum cupiditate voluptas. Quos, atque molestias!",
    createdAt: "2024-12-26 01:43:30 +0000",
    type: "CSAM"
}

const items: TabsProps['items'] = [
    {
        key: '',
        label: 'Status',
    },
    {
        key: 'Details',
        label: 'Details',
    },
    {
        key: 'Reports',
        label: 'Reports',
    },
];


export default function Case() {
    const navigate = useNavigate()

    const onChange = (key: string) => {
        navigate(key)
    };

    return (
        <Flex vertical>
            <Flex justify='space-between' align='center' wrap>
                <Flex vertical align='start'>
                    <Breadcrumb
                        items={[
                            {
                                href: '/',
                                title: "Home"
                            },
                            {
                                title: 'Cases',
                            },
                        ]}
                    />
                    <Flex gap={16} align='center'>
                        <h1>{caseDetail.title}</h1>
                        <Progress percent={60} steps={5} strokeColor={[green[6], green[6], green[6]]} showInfo={false} />
                    </Flex>
                </Flex>
                <Flex gap={16} align='center'>
                    <div>
                        Open In
                    </div>
                    <Flex gap={16}>
                        <Image width={36} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                        <Image width={36} src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />
                    </Flex>
                </Flex>
            </Flex>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} size='large' />
            <Outlet />
        </Flex>
    )
}
