import { Card, Col, Row } from 'antd'
import { Case } from '../../type/case';
import CaseCard from './CaseCard';

export default function CaseCardList({ cases }: { cases: Case[] }) {
    return (
        <Row gutter={[16, 16]}>
            {cases.map((caseInfo, index) => (
                <Col key={index} span={8}>
                    <CaseCard caseInfo={caseInfo} />
                </Col>
            ))}
        </Row>
    )
}