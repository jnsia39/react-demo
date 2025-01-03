import { Card, Col, Row } from 'antd'
import Meta from 'antd/es/card/Meta'

type Info = {
    title: string;
    description: string;
}

export default function ImageCardList({infos} : {infos: Info[]}) {
  return (
    <Row gutter={[16, 16]}>
        {infos.map((info, index) => (
            <Col key={index} md={{flex: '16.6%'}} sm={{ flex: '25%' }} xs={{ flex: '50%' }}>
                <Card
                    cover={
                        <img
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            alt="example"
                        />
                    }
                >
                    <Meta
                        title={info.title}
                        description={info.description}
                    />
                </Card>
            </Col>
        ))}
    </Row>
)
}
