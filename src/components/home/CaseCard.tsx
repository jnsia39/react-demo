import { Card, Flex, Tag } from 'antd';
import { Case } from '../../type/case';

const caseInfo2 = {
  id: 'CSE-39-0718',
  title: 'Hydrogen explosion',
  description:
    'The "successful" governess, it seems, manages her pupils into "successful" betrothals - just like the marriage plot novel.',
  createdAt: '2025-01-06 15:30',
  dueDate: '2026-01-06 15:30',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CaseCard({ caseInfo }: { caseInfo: Case }) {
  return (
    <Card hoverable>
      <Flex vertical gap={8}>
        <Flex justify="space-between" align="center">
          <Flex vertical>
            <h2>{caseInfo2.id}</h2>
            <p style={{ fontSize: '16px' }}>{caseInfo2.title}</p>
          </Flex>
          <div>
            <Tag color="processing">processing</Tag>
          </div>
        </Flex>
        <Flex vertical gap={8}>
          <Flex style={{ height: 48 }}>
            <p className="truncate-text">{caseInfo2.description}</p>
          </Flex>
          <Flex vertical>
            <p className="sub-text">Created: {caseInfo2.createdAt}</p>
            <p className="sub-text">Due date: {caseInfo2.dueDate}</p>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
