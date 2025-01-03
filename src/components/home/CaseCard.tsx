import { Card } from 'antd';
import { Case } from '../../type/case';

export default function CaseCard({ caseInfo }: { caseInfo: Case }) {
  return (
    <Card title={caseInfo.title} bordered={false}>
      {caseInfo.description}
    </Card>
  );
}
