
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeaveManagement = () => {
  const [selectedTab, setSelectedTab] = useState('my-leaves');

  const leaveBalances = [
    { type: 'Annual Leave', used: 8, total: 25, color: 'bg-blue-500' },
    { type: 'Sick Leave', used: 3, total: 10, color: 'bg-red-500' },
    { type: 'Personal Leave', used: 2, total: 5, color: 'bg-green-500' },
    { type: 'Maternity/Paternity', used: 0, total: 90, color: 'bg-purple-500' }
  ];

  const recentLeaves = [
    {
      id: 1,
      type: 'Annual Leave',
      dates: 'Jun 10 - Jun 14, 2024',
      days: 5,
      status: 'approved',
      reason: 'Family vacation'
    },
    {
      id: 2,
      type: 'Sick Leave',
      dates: 'May 28, 2024',
      days: 1,
      status: 'approved',
      reason: 'Medical appointment'
    },
    {
      id: 3,
      type: 'Personal Leave',
      dates: 'Jul 2, 2024',
      days: 1,
      status: 'pending',
      reason: 'Personal matter'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600">Manage your time off and leave requests</p>
        </div>
        <Link to="/leave/apply">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Apply for Leave
          </Button>
        </Link>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaveBalances.map((balance) => (
          <div key={balance.type} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{balance.type}</h3>
              <div className={`w-3 h-3 rounded-full ${balance.color}`}></div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium">{balance.used} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining</span>
                <span className="font-medium">{balance.total - balance.used} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${balance.color}`}
                  style={{ width: `${(balance.used / balance.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Leave Requests</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentLeaves.map((leave) => (
            <div key={leave.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {getStatusIcon(leave.status)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{leave.type}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{leave.dates}</p>
                    <p className="text-sm text-gray-600">{leave.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{leave.days} day{leave.days > 1 ? 's' : ''}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Leave</p>
              <p className="font-semibold text-gray-900">July 2, 2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Year</p>
              <p className="font-semibold text-gray-900">13 days used</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Team Status</p>
              <p className="font-semibold text-gray-900">3 on leave today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
