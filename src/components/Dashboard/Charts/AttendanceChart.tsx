
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEmployees } from '@/hooks/useEmployees';

const AttendanceChart = () => {
  const { employees } = useEmployees();
  
  // Generate chart data based on actual employee data
  const data = employees.length > 0 ? [
    { month: 'Current Month', present: employees.filter(emp => emp.status === 'active').length, absent: employees.filter(emp => emp.status === 'inactive').length }
  ] : [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
        <p className="text-sm text-gray-600">Employee attendance overview</p>
      </div>
      
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="present" fill="#3b82f6" name="Active Employees" />
            <Bar dataKey="absent" fill="#ef4444" name="Inactive Employees" />
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
