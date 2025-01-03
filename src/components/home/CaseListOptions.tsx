import { Flex, Radio, RadioChangeEvent, Select } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext';
import Search from 'antd/es/transfer/search'
import { useState } from 'react';

export default function CaseListOptions() {
    const [size, setSize] = useState<SizeType>('middle');

    const handleSizeChange = (e: RadioChangeEvent) => {
        setSize(e.target.value);
    };

    return (
        <Flex align='center' gap={8} wrap>
            <h4>sort by</h4>
            <Select
                showSearch
                placeholder="Select a status"
                optionFilterProp="label"
                onChange={() => { }}
                onSearch={() => { }}
                options={[
                    {
                        value: 'progress',
                        label: 'progress',
                    },
                ]}
            />
            <Flex>
                <Search placeholder="input search text" />
            </Flex>
            <Radio.Group value={size} onChange={handleSizeChange}>
                <Radio.Button value="large">Large</Radio.Button>
                <Radio.Button value="middle">Default</Radio.Button>
            </Radio.Group>
        </Flex>
    )
}
