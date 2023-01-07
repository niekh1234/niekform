import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

type SubmissionChartProps = {
  data: any[];
};

const SubmissionChart = ({ data }: SubmissionChartProps) => {
  console.log(data);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Tooltip animationDuration={200} content={<CustomTooltip />} />
        <Line type="monotone" dataKey="count" stroke="#10b981" dot={false} activeDot={false} />
        {/* <Line type="monotone" dataKey="count" stroke="#82ca9d" /> */}
      </LineChart>
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
