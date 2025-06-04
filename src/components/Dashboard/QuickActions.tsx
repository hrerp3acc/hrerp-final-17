
import { Button } from '@/components/ui/button';
import { Plus, Clock, FileText, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    {
      title: 'Add Employee',
      description: 'Register a new employee',
      icon: Plus,
      path: '/employees/add',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Clock In/Out',
      description: 'Track work hours',
      icon: Clock,
      path: '/time/tracking',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Apply Leave',
      description: 'Request time off',
      icon: Calendar,
      path: '/leave/apply',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Generate Report',
      description: 'Create HR reports',
      icon: FileText,
      path: '/reports/custom',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600">Frequently used functions</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.title} to={action.path}>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 text-left hover:shadow-md transition-shadow"
            >
              <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
