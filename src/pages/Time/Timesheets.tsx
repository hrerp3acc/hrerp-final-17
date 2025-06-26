
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Filter } from 'lucide-react';
import { useTimesheets } from '@/hooks/useTimesheets';
import TimesheetDialog from '@/components/Time/TimesheetDialog';
import { formatDistanceToNow, format } from 'date-fns';

const Timesheets = () => {
  const { timesheets, loading, submitTimesheet, getTimesheetStats } = useTimesheets();
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const stats = getTimesheetStats();
  
  const filteredTimesheets = timesheets.filter(timesheet => 
    selectedStatus === 'all' || timesheet.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitTimesheet = async (timesheetId: string) => {
    await submitTimesheet(timesheetId);
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
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-gray-600">Manage and submit your weekly timesheets</p>
        </div>
        <TimesheetDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Timesheets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filter by status:</span>
            </div>
            <div className="flex space-x-2">
              {['all', 'draft', 'submitted', 'approved', 'rejected'].map(status => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timesheets List */}
      {filteredTimesheets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No timesheets found</h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus === 'all' 
                ? 'Create your first timesheet to get started.' 
                : `No timesheets with status "${selectedStatus}" found.`}
            </p>
            <TimesheetDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTimesheets.map((timesheet) => (
            <Card key={timesheet.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Week of {format(new Date(timesheet.week_start_date), 'MMM dd, yyyy')}
                  </CardTitle>
                  <Badge className={getStatusColor(timesheet.status)}>
                    {timesheet.status}
                  </Badge>
                </div>
                <CardDescription>
                  {format(new Date(timesheet.week_start_date), 'MMM dd')} - {format(new Date(timesheet.week_end_date), 'MMM dd, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Hours:</span>
                    <span className="font-semibold">{timesheet.total_hours || 0}h</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm">{formatDistanceToNow(new Date(timesheet.created_at))} ago</span>
                  </div>

                  {timesheet.submitted_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Submitted:</span>
                      <span className="text-sm">{formatDistanceToNow(new Date(timesheet.submitted_at))} ago</span>
                    </div>
                  )}

                  {timesheet.approved_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Approved:</span>
                      <span className="text-sm">{formatDistanceToNow(new Date(timesheet.approved_at))} ago</span>
                    </div>
                  )}

                  {timesheet.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">{timesheet.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {timesheet.status === 'draft' && (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSubmitTimesheet(timesheet.id)}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timesheets;
