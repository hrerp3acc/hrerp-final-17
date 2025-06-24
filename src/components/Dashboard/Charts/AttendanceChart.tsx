
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEmployees } from '@/hooks/useEmployees';
import { useDashboard } from '@/hooks/useDashboard';
import { useMemo } from 'react';

const AttendanceChart = () => {
  const { employees } = useEmployees();
  const { stats } = useDashboard();
  
  // Generate attendance data based on actual employee data
  const data = useMemo(() => {
    const currentDate = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Simulate attendance data based on active employees
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status === 'active').length;
      
      // Simulate some variation in attendance
      const attendanceRate = totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0;
      const present = Math.round((attendanceRate / 100) * totalEmployees * (0.85 + Math.random() * 0.15));
      const absent = Math.max(0, totalEmployees - present);
      
      months.push({
        month: monthName,
        present,
        absent,
        total: totalEmployees
      });
    }
    
    return months;
  }, [employees]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
        <p className="text-sm text-gray-600">Monthly attendance overview</p>
      </div>
      
      {data.length > 0 && employees.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${value} employees`, 
                name === 'present' ? 'Present' : 'Absent'
              ]}
            />
            <Bar dataKey="present" fill="#10b981" name="Present" />
            <Bar dataKey="absent" fill="#ef4444" name="Absent" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">No attendance data available</p>
            <p className="text-sm">Add employees to see attendance trends</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceChart;
