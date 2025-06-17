
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLeaveManagement } from '@/hooks/useLeaveManagement';

const LeaveManagement = () => {
  const { 
    leaveApplications, 
    isLoading, 
    getLeaveBalance 
  } = useLeaveManagement();
  
  const leaveBalance = getLeaveBalance();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLeaveType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading leave applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Leave Applications</h1>
          <p className="text-gray-600">Manage your leave requests and view balances</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Leave Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{leaveBalance.total}</div>
            <p className="text-xs text-gray-600">Annual allowance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Used Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{leaveBalance.used}</div>
            <p className="text-xs text-gray-600">Days taken this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Remaining Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{leaveBalance.remaining}</div>
            <p className="text-xs text-gray-600">Available to use</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {leaveApplications.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No leave applications found</p>
              <p className="text-sm text-gray-400">Apply for leave to see your requests here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaveApplications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <span className="font-medium text-gray-900">
                        {formatLeaveType(application.leave_type)}
                      </span>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      Applied {new Date(application.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Duration:</span>
                      <span className="ml-2">
                        {new Date(application.start_date).toLocaleDateString()} - {new Date(application.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    {application.reason && (
                      <div>
                        <span className="font-medium text-gray-600">Reason:</span>
                        <span className="ml-2">{application.reason}</span>
                      </div>
                    )}
                  </div>

                  {application.approved_by_employee && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-600">
                        {application.status === 'approved' ? 'Approved by:' : 'Reviewed by:'}
                      </span>
                      <span className="ml-2">
                        {application.approved_by_employee.first_name} {application.approved_by_employee.last_name}
                      </span>
                      {application.approved_at && (
                        <span className="ml-2 text-gray-500">
                          on {new Date(application.approved_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveManagement;
