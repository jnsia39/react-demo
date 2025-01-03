import { Avatar, Col, Flex, List, Progress, Row, Tag } from "antd";
import CaseTimeLine from "../../components/case/CaseTimeLine";

const caseDetail = {
  title: "CSE-23-0025",
  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia quidem in optio ab quam neque quia perferendis similique labore cum vel exercitationem, recusandae deleniti eum cupiditate voluptas. Quos, atque molestias!",
  createdAt: "2024-12-26 01:43:30 +0000",
  type: "CSAM"
}

const members = [
  {
      title: 'Ant Design Title 1',
  },
  {
      title: 'Ant Design Title 2',
  },
  {
      title: 'Ant Design Title 3',
  },
  {
      title: 'Ant Design Title 4',
  },
];

const statuses = [
  { date: "2023-10-11 11:36 +0000", status: "In Progress" },
  { date: "2023-10-12 09:20 +0000", status: "Completed" },
  { date: "2023-10-13 14:45 +0000", status: "Pending Review" },
  { date: "2023-10-14 08:15 +0000", status: "In Progress" },
  { date: "2023-10-15 10:00 +0000", status: "On Hold" },
];

export default function CaseStatus() {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <h3 style={{ color: 'gray' }}>STATUS</h3>
          <h2>In-progress</h2>
          <br />
          <p>{caseDetail.description}</p>
          <br />
          <h4>Created: {caseDetail.createdAt}</h4>
          <h4>Type: {caseDetail.type}</h4>
        </Col>
        <Col span={8}>
          <h2>Evidence sources</h2>
          <br />
          <Flex wrap>
            <Flex gap={16} align='center'>
              <h4>CSE-23-0025-EVD-1</h4>
              <p>Apple Iphone X</p>
              <Tag color="processing">processing</Tag>
            </Flex>
            <Progress size="small" percent={60} showInfo={false} />
          </Flex>
        </Col>
        <Col span={8}>
          <h2>Team <Tag>{members.length}</Tag></h2>
          <br />
          <List
            itemLayout="horizontal"
            dataSource={members}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={<a href="https://ant.design">{item.title}</a>}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Flex style={{ backgroundColor: "white" }}>
        <Flex vertical align='center' gap={8} wrap>
          <CaseTimeLine statuses={statuses} />
        </Flex>
      </Flex>
    </>
  )
}
