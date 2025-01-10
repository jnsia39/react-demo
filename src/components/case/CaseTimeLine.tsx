import { Timeline } from 'antd';

interface Status {
  date: string;
  status: string;
}

export default function CaseTimeLine({ statuses }: { statuses: Status[] }) {
  return (
    <Timeline
      style={{ margin: 20 }}
      items={statuses.map((status) => {
        return {
          color: 'blue',
          children: (
            <h3>
              <span style={{ color: 'gray' }}>{status.date}</span> Status
              updated to "{status.status}"
            </h3>
          ),
        };
      })}
    />
  );
}