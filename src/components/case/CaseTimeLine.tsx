import { Timeline } from 'antd'

interface Status {
    date: string;
    status: string;
}


export default function CaseTimeLine({ statuses }: { statuses: Status[] }) {
    return (
        <Timeline
            style={{ margin: 20 }}
        >
            {statuses.map((status, index) => (
                <Timeline.Item key={index}>
                    <h3>
                        <span style={{ color: "gray" }}>{status.date}</span> Status updated to "{status.status}"
                    </h3>
                </Timeline.Item>
            ))}
        </Timeline>
    )
}
