import { Button, Flex, Select } from 'antd';
import Search from 'antd/es/transfer/search';

export default function CaseListOptions() {
  return (
    <Flex align="center" gap={16} wrap>
      <p>Sort by</p>
      <Select
        showSearch
        placeholder="Select a status"
        optionFilterProp="label"
        onChange={() => {}}
        onSearch={() => {}}
        options={[
          {
            value: 'progress',
            label: 'progress',
          },
        ]}
      />
      <p>Case type</p>
      <Select
        showSearch
        placeholder="Select a status"
        optionFilterProp="label"
        onChange={() => {}}
        onSearch={() => {}}
        options={[
          {
            value: 'progress',
            label: 'progress',
          },
        ]}
      />
      <Flex gap={4}>
        <Search placeholder="input search text" />
        <Button type="primary">Search</Button>
      </Flex>
    </Flex>
  );
}
