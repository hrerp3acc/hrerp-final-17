
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Calendar, 
  FileText, 
  UserPlus, 
  CheckSquare,
  BarChart3,
  Settings
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add Employee',
      description: 'Create new employee profile',
      icon: UserPlus,
      onClick: () => navigate('/employees/add'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Time Tracking',
      description: 'Start or stop time tracking',
      icon: Clock,
      onClick: () => navigate('/time/tracking'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Apply for Leave',
      description: 'Submit leave application',
      icon: Calendar,
      onClick: () => navigate('/leave/apply'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Check Attendance',
      description: 'Mark your attendance',
      icon: CheckSquare,
      onClick: () => navigate('/time/attendance'),
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'View Employees',
      description: 'Browse employee directory',
      icon: Users,
      onClick: () => navigate('/employees'),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Reports',
      description: 'Generate reports',
      icon: BarChart3,
      onClick: () => navigate('/reports'),
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Timesheets',
      description: 'Manage timesheets',
      icon: FileText,
      onClick: () => navigate('/time/timesheets'),
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      title: 'Admin Panel',
      description: 'System administration',
      icon: Settings,
      onClick: () => navigate('/admin'),
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
      <Card className="h-full rounded-none border-0 shadow-none">
        <CardHeader className="text-center py-8">
          <CardTitle className="text-4xl font-bold text-gray-900">Quick Actions</CardTitle>
          <p className="text-lg text-gray-600 mt-2">Choose an action to get started</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-32 flex flex-col items-center justify-center space-y-4 text-white border-0 ${action.color} transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl`}
                onClick={action.onClick}
              >
                <action.icon className="w-10 h-10" />
                <div className="text-center">
                  <div className="text-base font-semibold">{action.title}</div>
                  <div className="text-sm opacity-90 mt-1">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
