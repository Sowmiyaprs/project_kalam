import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function WeeklyAnalyticsChart({ data = [] }) {
  // Group data by day of week
  const dayMap = {};
  
  data.forEach((analysis) => {
    const date = new Date(analysis.timestamp);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    if (!dayMap[dayName]) {
      dayMap[dayName] = {
        day: dayName,
        stress: [],
        motivation: [],
        confidence: [],
        balance: [],
      };
    }
    
    dayMap[dayName].stress.push(analysis.metrics?.stress || 0);
    dayMap[dayName].motivation.push(analysis.metrics?.motivation || 0);
    dayMap[dayName].confidence.push(analysis.metrics?.confidence || 0);
    dayMap[dayName].balance.push(analysis.metrics?.emotionalBalance || 0);
  });

  // Calculate averages
  const chartData = Object.values(dayMap).map((day) => ({
    day: day.day,
    stress: Math.round(day.stress.reduce((a, b) => a + b, 0) / day.stress.length),
    motivation: Math.round(day.motivation.reduce((a, b) => a + b, 0) / day.motivation.length),
    confidence: Math.round(day.confidence.reduce((a, b) => a + b, 0) / day.confidence.length),
    balance: Math.round(day.balance.reduce((a, b) => a + b, 0) / day.balance.length),
  }));

  // Sort by day of week
  const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  chartData.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-bold mb-2 text-white">{payload[0].payload.day}</p>
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
          <p>No weekly data available yet</p>
          <p className="text-sm mt-1">Check in daily to see patterns</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF006E" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#FF006E" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="motivationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B026FF" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#B026FF" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#00D9FF" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39FF14" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#39FF14" stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="day" 
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
          iconType="rect"
        />
        <Bar dataKey="stress" fill="url(#stressGradient)" name="Stress" radius={[8, 8, 0, 0]} />
        <Bar dataKey="motivation" fill="url(#motivationGradient)" name="Motivation" radius={[8, 8, 0, 0]} />
        <Bar dataKey="confidence" fill="url(#confidenceGradient)" name="Confidence" radius={[8, 8, 0, 0]} />
        <Bar dataKey="balance" fill="url(#balanceGradient)" name="Balance" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
