
import { Clock, User, Calendar, FileText } from 'lucide-react';

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: 'leave',
      message: 'Sarah Johnson applied for annual leave',
      time: '2 minutes ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'employee',
      message: 'New employee Michael Chen joined Marketing',
      time: '1 hour ago',
      icon: User,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'report',
      message: 'Monthly payroll report generated',
      time: '3 hours ago',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'time',
      message: 'Overtime approved for Development team',
      time: '5 hours ago',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        <p className="text-sm text-gray-600">Latest system updates</p>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`mt-1 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all activities →
      </button>
    </div>
  );
};

export default RecentActivities;
