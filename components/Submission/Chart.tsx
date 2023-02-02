import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

type SubmissionChartProps = {
  data: any[];
};

const SubmissionChart = ({ data }: SubmissionChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid vertical={false} stroke="#d1fae5" />
        <YAxis width={30} stroke="#9ca3af" />
        <Tooltip active animationDuration={0} content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm font-bold">{payload[0].payload.date}</p>
        <p className="text-sm">{payload[0].value} submissions</p>
      </div>
    );
  }

  return null;
};

export default SubmissionChart;
