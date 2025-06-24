
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEmployees } from '@/hooks/useEmployees';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { useMemo } from 'react';

const PerformanceChart = () => {
  const { employees } = useEmployees();
  const { goals, reviews } = usePerformanceManagement();
  
  // Generate performance data based on actual goals and reviews
  const data = useMemo(() => {
    const currentDate = new Date();
    const quarters = [];
    
    for (let i = 3; i >= 0; i--) {
      const quarterStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i * 3), 1);
      const quarterEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i * 3) + 3, 0);
      const quarterName = `Q${Math.ceil((quarterEnd.getMonth() + 1) / 3)} ${quarterEnd.getFullYear()}`;
      
      // Calculate performance based on goals completed in this quarter
      const quarterGoals = goals.filter(goal => {
        const goalDate = new Date(goal.created_at);
        return goalDate >= quarterStart && goalDate <= quarterEnd;
      });
      
      const performance = quarterGoals.length > 0 
        ? quarterGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / quarterGoals.length
        : employees.length > 0 ? Math.floor((employees.filter(emp => emp.status === 'active').length / employees.length) * 100) : 0;
      
      quarters.push({
        quarter: quarterName,
        performance: Math.round(performance),
        goals: quarterGoals.length
      });
    }
    
    return quarters;
  }, [goals, employees]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
        <p className="text-sm text-gray-600">Quarterly performance metrics</p>
      </div>
      
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Performance Score']}
              labelFormatter={(label) => `Quarter: ${label}`}
            />
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
            <p className="text-sm">Set up goals and reviews to see performance trends</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
