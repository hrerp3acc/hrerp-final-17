
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AttendanceChart = () => {
  const data = [
    { month: 'Jan', present: 85, absent: 15 },
    { month: 'Feb', present: 88, absent: 12 },
    { month: 'Mar', present: 92, absent: 8 },
    { month: 'Apr', present: 87, absent: 13 },
    { month: 'May', present: 90, absent: 10 },
    { month: 'Jun', present: 94, absent: 6 }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
        <p className="text-sm text-gray-600">Monthly attendance overview</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="present" fill="#3b82f6" name="Present %" />
          <Bar dataKey="absent" fill="#ef4444" name="Absent %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
