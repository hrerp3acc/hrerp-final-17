
import { Clock, User, Calendar, FileText, Plus } from 'lucide-react';

const RecentActivities = () => {
  const activities: any[] = [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        <p className="text-sm text-gray-600">Latest system updates</p>
      </div>
      
      {activities.length > 0 ? (
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
          <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all activities →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No recent activities</h4>
          <p className="text-gray-600 mb-4">
            Activities will appear here as your team starts using the system
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
