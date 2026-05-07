import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MoodTrendChart({ data = [] }) {
  const chartData = data.map((analysis) => {
    const date = new Date(analysis.timestamp);
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      stress: analysis.metrics?.stress || 0,
      motivation: analysis.metrics?.motivation || 0,
      confidence: analysis.metrics?.confidence || 0,
      balance: analysis.metrics?.emotionalBalance || 0,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-bold mb-2 text-white">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No mood data available yet</p>
          <p className="text-sm mt-1">Start analyzing to see trends</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF006E" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#FF006E" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorMotivation" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B026FF" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#B026FF" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#00D9FF" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
          iconType="line"
        />
        <Line 
          type="monotone" 
          dataKey="stress" 
          stroke="#FF006E" 
          strokeWidth={3}
          dot={{ fill: '#FF006E', r: 5 }}
          activeDot={{ r: 7 }}
          name="Stress"
        />
        <Line 
          type="monotone" 
          dataKey="motivation" 
          stroke="#B026FF" 
          strokeWidth={3}
          dot={{ fill: '#B026FF', r: 5 }}
          activeDot={{ r: 7 }}
          name="Motivation"
        />
        <Line 
          type="monotone" 
          dataKey="confidence" 
          stroke="#00D9FF" 
          strokeWidth={3}
          dot={{ fill: '#00D9FF', r: 5 }}
          activeDot={{ r: 7 }}
          name="Confidence"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
