import React from 'react';
import { Space, Table, Tag } from 'antd';

const { Column, ColumnGroup } = Table;

interface Member {
  id: number;
  type: string;
  name: string;
  accessedAt: string;
}

const data: Member[] = [
  {
    id: 1,
    type: 'CASE',
    name: '[CASE-204] Car Accident',
    accessedAt: 'a hour ago',
  },
  {
    id: 2,
    type: 'CASE',
    name: '[CASE-204] Car Accident',
    accessedAt: 'a hour ago',
  },
  {
    id: 3,
    type: 'CASE',
    name: '[CASE-204] Car Accident',
    accessedAt: 'a hour ago',
  },
  {
    id: 4,
    type: 'A/R',
    name: '[CASE-204] Car Accident',
    accessedAt: 'a hour ago',
  },
  {
    id: 5,
    type: 'A/R',
    name: '[CASE-204] Car Accident',
    accessedAt: 'a hour ago',
  },
  {
    id: 6,
    type: 'A/R',
    name: '[CASE-204] Car Accident',
    accessedAt: 'a hour ago',
  },
];

export default function CaseDetails() {
  return (
    <Table<Member> dataSource={data}>
      <Column title="Type" dataIndex="type" key="type" />
      <Column title="Name" dataIndex="name" key="name" />
      <Column title="AccessedAt" dataIndex="accessedAt" key="accessedAt" />
      {/* <Column
        title="Action"
        key="action"
        render={(record: Member) => (
          <Space size="middle">
            <a>Invite {record.name}</a>
            <a>Delete</a>
          </Space>
        )}
      /> */}
    </Table>
  );
}
