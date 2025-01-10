import { Table } from 'antd';
import { ReactNode } from 'react';

const { Column } = Table;

interface Member {
  id: number;
  type: string;
  name: ReactNode;
  accessedAt: string;
}

const data: Member[] = [
  {
    id: 1,
    type: 'CASE',
    name: <a href="#"> '[CASE-204] Car Accident'</a>,
    accessedAt: 'a hour ago',
  },
  {
    id: 2,
    type: 'CASE',
    name: <a href="#"> '[CASE-204] Car Accident'</a>,
    accessedAt: 'a hour ago',
  },
  {
    id: 3,
    type: 'CASE',
    name: <a href="#"> '[CASE-204] Car Accident'</a>,
    accessedAt: 'a hour ago',
  },
  {
    id: 4,
    type: 'A/R',
    name: <a href="#"> '[CASE-204] Car Accident'</a>,
    accessedAt: 'a hour ago',
  },
  {
    id: 5,
    type: 'A/R',
    name: <a href="#"> '[CASE-204] Car Accident'</a>,
    accessedAt: 'a hour ago',
  },
  {
    id: 6,
    type: 'A/R',
    name: <a href="#"> '[CASE-204] Car Accident'</a>,
    accessedAt: 'a hour ago',
  },
];

export default function RecentilyAccessedTable() {
  return (
    <Table<Member> dataSource={data} pagination={false}>
      <Column title="Type" dataIndex="type" key="type" />
      <Column title="Name" dataIndex="name" key="name" />
      <Column title="AccessedAt" dataIndex="accessedAt" key="accessedAt" />
    </Table>
  );
}
