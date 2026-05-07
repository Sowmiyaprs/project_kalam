import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const EMOTION_COLORS = {
  'Happy': '#39FF14',
  'Sad': '#6366F1',
  'Angry': '#DC2626',
  'Anxious': '#FFA500',
  'Stressed': '#FF006E',
  'Confident': '#00D9FF',
  'Motivated': '#B026FF',
  'Tired': '#9333EA',
  'Calm': '#10B981',
  'Neutral': '#9CA3AF',
};

export default function EmotionDistributionChart({ data = {} }) {
  // Transform mood distribution object to array
  const chartData = Object.entries(data).map(([emotion, count]) => ({
    name: emotion,
    value: count,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-bold text-white">{payload[0].name}</p>
          <p className="text-sm text-gray-300">
            Count: {payload[0].value}
          </p>
          <p className="text-sm text-gray-300">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show label if less than 5%

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
        style={{ textShadow: '0 0 3px rgba(0,0,0,0.8)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🥧</div>
          <p>No emotion data available yet</p>
          <p className="text-sm mt-1">Start analyzing to see distribution</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={EMOTION_COLORS[entry.name] || '#9CA3AF'} 
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
          iconType="circle"
          formatter={(value) => <span className="text-gray-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
