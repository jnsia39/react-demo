import { Flex } from 'antd';
import { Cell, Legend, Pie, PieChart } from 'recharts';

interface ChartProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  index: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const data = [
  { name: 'Processing', value: 27 },
  { name: 'Available', value: 25 },
  { name: 'Offline', value: 18 },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  index,
}: ChartProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.45;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {data[index].value}
    </text>
  );
};

const Chart = ({
  type,
  width,
  height,
}: {
  type: string;
  width: number;
  height: number;
}) => {
  return (
    <Flex vertical justify="center" align="center">
      <h3>{type}</h3>
      <PieChart width={width} height={height}>
        {width > 160 && <Legend verticalAlign="bottom" />}
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          fill="#8884d8"
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </Flex>
  );
};

export default Chart;
