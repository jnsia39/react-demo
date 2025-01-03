import { Card } from 'antd'
import { Case } from '../../type/case'

export default function CaseCard({caseInfo}: {caseInfo: Case}) {
  return (
    <Card>
        <p>{caseInfo.title}</p>
        <p>{caseInfo.description}</p>
    </Card>
  )
}
