
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLeaveManagement } from '@/hooks/useLeaveManagement';
import { useNavigate } from 'react-router-dom';

const LeaveAttendance = () => {
  const navigate = useNavigate();
  const { leaveApplications, loading } = useLeaveManagement();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredApplications = leaveApplications.filter(app => {
    if (selectedFilter === 'all') return true;
    return app.status === selectedFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplyLeave = () => {
    navigate('/leave/apply');
  };

  const stats = {
    total: leaveApplications.length,
    pending: leaveApplications.filter(app => app.status === 'pending').length,
    approved: leaveApplications.filter(app => app.status === 'approved').length,
    rejected: leaveApplications.filter(app => app.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave & Attendance</h1>
          <p className="text-gray-600">Manage your leave applications and attendance records</p>
        </div>
        <Button onClick={handleApplyLeave}>
          <Plus className="w-4 h-4 mr-2" />
          Apply for Leave
        </Button>
      </div>

      {/* Leave Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Leave Applications</span>
            <div className="flex space-x-2">
              {['all', 'pending', 'approved', 'rejected'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No leave applications found</p>
                <Button className="mt-4" onClick={handleApplyLeave}>
                  <Plus className="w-4 h-4 mr-2" />
                  Apply for Leave
                </Button>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(application.status)}
                      <div>
                        <h4 className="font-medium capitalize">{application.leave_type.replace('_', ' ')} Leave</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(application.start_date).toLocaleDateString()} - {new Date(application.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                  
                  {application.reason && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Reason: </span>
                        {application.reason}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Applied: </span>
                      {new Date(application.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Duration: </span>
                      {Math.ceil((new Date(application.end_date).getTime() - new Date(application.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                    </div>
                    {application.approved_by && (
                      <div>
                        <span className="font-medium">Approved by: </span>
                        Manager
                      </div>
                    )}
                    {application.approved_at && (
                      <div>
                        <span className="font-medium">Approved on: </span>
                        {new Date(application.approved_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveAttendance;
