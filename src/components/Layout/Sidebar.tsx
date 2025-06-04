
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users, BarChart3, Calendar, Clock, CreditCard, 
  Settings, User, BookOpen, TrendingUp, Building,
  FileText, Shield, ChevronDown, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  userRole: 'admin' | 'manager' | 'employee';
}

const Sidebar = ({ userRole }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: BarChart3,
      path: '/',
      roles: ['admin', 'manager', 'employee']
    },
    {
      id: 'employees',
      title: 'Employee Management',
      icon: Users,
      roles: ['admin', 'manager'],
      children: [
        { title: 'Employee Directory', path: '/employees' },
        { title: 'Add Employee', path: '/employees/add' },
        { title: 'Org Chart', path: '/employees/org-chart' }
      ]
    },
    {
      id: 'time',
      title: 'Time Management',
      icon: Clock,
      roles: ['admin', 'manager', 'employee'],
      children: [
        { title: 'Time Tracking', path: '/time/tracking' },
        { title: 'Attendance', path: '/time/attendance' },
        { title: 'Timesheets', path: '/time/timesheets' }
      ]
    },
    {
      id: 'leave',
      title: 'Leave Management',
      icon: Calendar,
      roles: ['admin', 'manager', 'employee'],
      children: [
        { title: 'My Leaves', path: '/leave/my-leaves' },
        { title: 'Apply Leave', path: '/leave/apply' },
        { title: 'Team Calendar', path: '/leave/calendar' }
      ]
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: TrendingUp,
      roles: ['admin', 'manager', 'employee'],
      children: [
        { title: 'Goals', path: '/performance/goals' },
        { title: 'Reviews', path: '/performance/reviews' },
        { title: 'Analytics', path: '/performance/analytics' }
      ]
    },
    {
      id: 'payroll',
      title: 'Payroll',
      icon: CreditCard,
      roles: ['admin'],
      children: [
        { title: 'Salary Management', path: '/payroll/salary' },
        { title: 'Payslips', path: '/payroll/payslips' },
        { title: 'Reports', path: '/payroll/reports' }
      ]
    },
    {
      id: 'learning',
      title: 'Learning & Development',
      icon: BookOpen,
      roles: ['admin', 'manager', 'employee'],
      children: [
        { title: 'Training Catalog', path: '/learning/catalog' },
        { title: 'My Learning', path: '/learning/my-learning' },
        { title: 'Certifications', path: '/learning/certifications' }
      ]
    },
    {
      id: 'reports',
      title: 'Analytics & Reports',
      icon: FileText,
      roles: ['admin', 'manager'],
      children: [
        { title: 'HR Analytics', path: '/reports/analytics' },
        { title: 'Custom Reports', path: '/reports/custom' },
        { title: 'Compliance', path: '/reports/compliance' }
      ]
    },
    {
      id: 'admin',
      title: 'Administration',
      icon: Settings,
      roles: ['admin'],
      children: [
        { title: 'User Management', path: '/admin/users' },
        { title: 'System Config', path: '/admin/config' },
        { title: 'Security', path: '/admin/security' }
      ]
    }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="h-full bg-white border-r border-gray-200 w-64 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">HR ERP</h1>
            <p className="text-xs text-gray-500">Enterprise Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => (
          <div key={item.id}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  {expandedItems.includes(item.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedItems.includes(item.id) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-lg transition-colors",
                          location.pathname === child.path
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path!}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
