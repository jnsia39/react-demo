import { Card, List, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import userApi from '../../api/user/api';
import { DataType } from '../../type/data';

export default function RecentilyAccessedCard() {
    const [initLoading, setInitLoading] = useState(true);
    const [list, setList] = useState<DataType[]>([]);

    useEffect(() => {
        userApi.getUsers()
            .then((res) => {
                console.log(res.data)
                setInitLoading(false);
                setList([])
            });
    }, []);

    return (
        <Card title="Recentily accessed" bordered={false}>
            <List
                loading={initLoading}
                itemLayout="horizontal"
                dataSource={list}
                style={{ height: 240, overflowY: 'scroll' }}
                renderItem={(item) => (
                    <List.Item>
                        <Skeleton title={false} loading={item.loading} active>
                            <List.Item.Meta
                                title={<div><span>{item.name} </span><span style={{ color: 'gray' }}>{item.email}</span></div>}
                                description={<a>View</a>}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        </Card>
    )
}
