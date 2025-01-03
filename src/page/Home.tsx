import { Button, Col, Flex, Image, Row } from 'antd'
import NotificationContainer from '../components/home/NotificationContainer';
import RecentilyAccessedCard from '../components/home/RecentilyAccessedCard';
import CaseListOptions from '../components/home/CaseListOptions';
import CaseCardList from '../components/home/CaseCardList';
import ImageCardList from '../components/common/ImageCardList';

const cases = [
    { "title": "case 1", "description": "case description 1" },
    { "title": "case 2", "description": "case description 2" },
    { "title": "case 3", "description": "case description 3" },
    { "title": "case 4", "description": "case description 4" },
    { "title": "case 5", "description": "case description 5" },
]

const infos = [
    { "title": "info 1", "description": "info description 1" },
    { "title": "info 2", "description": "info description 2" },
    { "title": "info 3", "description": "info description 3" },
    { "title": "info 4", "description": "info description 4" },
    { "title": "info 5", "description": "info description 5" },
    { "title": "info 6", "description": "info description 6" },
]

export default function Home() {
    return (
        <Flex gap={24} vertical>
            <Flex gap={16} justify='space-between' align='center' wrap>
                <Flex vertical gap={12} align='start'>
                    <h1 style={{ lineHeight: 1 }}>Welcome, Tom</h1>
                    <Flex gap={8}>
                        <Button type='primary'>button1</Button>
                        <Button>button2</Button>
                    </Flex>
                </Flex>
                <Flex gap={16} align='center'>
                    <div>
                        Your Products
                    </div>
                    <Flex gap={16}>
                        <Image width={36} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                        <Image width={36} src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />
                    </Flex>
                </Flex>
            </Flex>
            <Row gutter={[16, 16]}>
                <Col sm={{ flex: '50%' }} xs={{ flex: '100%' }}>
                    <NotificationContainer />
                </Col>
                <Col sm={{ flex: '50%' }} xs={{ flex: '100%' }}>
                    <RecentilyAccessedCard />
                </Col>
            </Row>
            <Flex gap={16} vertical>
                <Flex justify='space-between' gap={8} wrap>
                    <h1>Your Cases</h1>
                    <CaseListOptions />
                </Flex>
                <CaseCardList cases={cases} />
            </Flex>
            <Flex gap={16} vertical>
                <h1>Learn More</h1>
                <ImageCardList infos={infos} />
            </Flex>
        </Flex>
    )
}
