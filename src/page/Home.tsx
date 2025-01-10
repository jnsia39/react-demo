import { Card, Col, Flex, Progress, Row, Tag } from 'antd';
import CaseListOptions from '../components/home/CaseListOptions';
import CaseCardList from '../components/home/CaseCardList';
import { useEffect, useRef, useState } from 'react';
import RecentilyAccessedTable from './case/RecentilyAccessedTable';
import Chart from '../components/common/Chart';

const cases = [
  { title: 'case 1', description: 'case description 1' },
  { title: 'case 2', description: 'case description 2' },
  { title: 'case 3', description: 'case description 3' },
  { title: 'case 4', description: 'case description 4' },
  { title: 'case 5', description: 'case description 5' },
];

export default function Home() {
  const chartContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      if (chartContainerRef.current) {
        resizeObserver.unobserve(chartContainerRef.current);
      }
    };
  }, []);

  return (
    <Flex gap={24} vertical>
      {/* <Flex gap={16} justify="space-between" align="center">
        <Flex vertical gap={12} align="start">
          <h1>Welcome, Tom</h1>
          <Flex gap={8}>
            <Button type="primary" onClick={() => setOpen(true)}>
              Create Case
            </Button>
            <Button>Send Request</Button>
          </Flex>
        </Flex>
        <Flex gap={16} align="center">
          <h4>Your Products</h4>
          <Flex gap={16}>
            <Image
              width={36}
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
            <Image
              width={36}
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            />
          </Flex>
        </Flex>
      </Flex> */}
      {/* <Row gutter={[16, 16]}>
        <Col sm={{ flex: '50%' }} xs={{ flex: '100%' }}>
          <NotificationContainer />
        </Col>
        <Col sm={{ flex: '50%' }} xs={{ flex: '100%' }}>
          <RecentilyAccessedCard />
        </Col>
      </Row> */}
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title={'Recentily Accessed'}>
            {/* <h3>Recentily Accessed</h3> */}
            <RecentilyAccessedTable />
          </Card>
        </Col>
        <Col span={8}>
          <Flex gap={16} vertical style={{ height: '100%' }}>
            <Card title="Lab System Status" style={{ height: '100%' }}>
              <Flex
                ref={chartContainerRef}
                style={{
                  minHeight: 200,
                  height: '100%',
                  maxHeight: dimensions.height - 48,
                }}
              >
                <Chart
                  type="Nodes"
                  width={dimensions.width / 2}
                  height={dimensions.height}
                />
                <Chart
                  type="Pods"
                  width={dimensions.width / 2}
                  height={dimensions.height}
                />
              </Flex>
            </Card>
            <Card title="License Status">
              <Flex vertical gap={16}>
                <Progress
                  success={{ percent: 84 }}
                  percent={94}
                  strokeColor="orange"
                  trailColor="red"
                  showInfo={false}
                />
                <Flex gap={16} justify="center" wrap>
                  <Flex justify="center" align="center">
                    <Tag color="success">Activated:</Tag>
                    <h4> 42</h4>
                  </Flex>
                  <Flex justify="center" align="center">
                    <Tag color="warning">Expiring</Tag>
                    <h3>5</h3>
                  </Flex>
                  <Flex justify="center" align="center">
                    <Tag color="error">Expired</Tag>
                    <h3>3</h3>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </Flex>
        </Col>
      </Row>
      <Flex gap={16} vertical>
        <Card title={'My Cases'}>
          <CaseCardList cases={cases} />
        </Card>
      </Flex>
      <Flex gap={16} vertical>
        <Flex justify="space-between" gap={8} wrap>
          <h1>Your Cases</h1>
          <CaseListOptions />
        </Flex>
        <CaseCardList cases={cases} />
      </Flex>
      {/* <Flex gap={16} vertical>
        <h1>Learn More</h1>
        <ImageCardList infos={infos} />
      </Flex>
      <CaseCreateModal open={open} setOpen={setOpen} /> */}
    </Flex>
  );
}
