
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEmployees } from '@/hooks/useEmployees';

const PerformanceChart = () => {
  const { employees } = useEmployees();
  
  // Generate performance data based on actual employee data
  const data = employees.length > 0 ? [
    { quarter: 'Current', performance: employees.length > 0 ? Math.floor((employees.filter(emp => emp.status === 'active').length / employees.length) * 100) : 0 }
  ] : [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
        <p className="text-sm text-gray-600">Employee performance metrics</p>
      </div>
      
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">No performance data available</p>
            <p className="text-sm">Add employees to see performance trends</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
