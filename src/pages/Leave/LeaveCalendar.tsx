
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, User, Clock } from 'lucide-react';

interface LeaveEvent {
  id: string;
  employee: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending' | 'rejected';
}

const LeaveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');

  const leaveEvents: LeaveEvent[] = [
    {
      id: '1',
      employee: 'Sarah Johnson',
      department: 'Marketing',
      leaveType: 'Annual Leave',
      startDate: '2024-06-10',
      endDate: '2024-06-14',
      status: 'approved'
    },
    {
      id: '2',
      employee: 'Michael Chen',
      department: 'Engineering',
      leaveType: 'Sick Leave',
      startDate: '2024-06-05',
      endDate: '2024-06-05',
      status: 'approved'
    },
    {
      id: '3',
      employee: 'Emily Rodriguez',
      department: 'HR',
      leaveType: 'Personal Leave',
      startDate: '2024-06-20',
      endDate: '2024-06-21',
      status: 'pending'
    }
  ];

  const departments = ['all', 'Marketing', 'Engineering', 'HR', 'Finance', 'Sales'];
  const leaveTypes = ['all', 'Annual Leave', 'Sick Leave', 'Personal Leave', 'Emergency Leave'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day: number) => {
    if (!day) return [];
    
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return leaveEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const checkDate = new Date(dateStr);
      
      const matchesDepartment = selectedDepartment === 'all' || event.department === selectedDepartment;
      const matchesLeaveType = selectedLeaveType === 'all' || event.leaveType === selectedLeaveType;
      
      return checkDate >= eventStart && checkDate <= eventEnd && matchesDepartment && matchesLeaveType;
    });
  };

  const getEventColor = (leaveType: string, status: string) => {
    if (status === 'pending') return 'bg-yellow-200 text-yellow-800';
    if (status === 'rejected') return 'bg-red-200 text-red-800';
    
    switch (leaveType) {
      case 'Annual Leave': return 'bg-blue-200 text-blue-800';
      case 'Sick Leave': return 'bg-red-200 text-red-800';
      case 'Personal Leave': return 'bg-green-200 text-green-800';
      case 'Emergency Leave': return 'bg-orange-200 text-orange-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const upcomingLeaves = leaveEvents
    .filter(event => new Date(event.startDate) >= new Date() && event.status === 'approved')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Leave Calendar</h1>
          <p className="text-gray-600">View team leave schedules and plan accordingly</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Calendar className="w-4 h-4 mr-2" />
          Export Calendar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
              <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const events = getEventsForDate(day);
                return (
                  <div
                    key={index}
                    className={`min-h-24 p-1 border border-gray-200 ${
                      day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                        <div className="space-y-1">
                          {events.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${getEventColor(event.leaveType, event.status)}`}
                              title={`${event.employee} - ${event.leaveType}`}
                            >
                              {event.employee.split(' ')[0]}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{events.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Leaves */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Upcoming Leaves</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingLeaves.map(leave => (
                <div key={leave.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-sm">{leave.employee}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{leave.department}</p>
                  <p className="text-xs font-medium text-gray-900">{leave.leaveType}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {upcomingLeaves.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming approved leaves
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span className="text-sm">Annual Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span className="text-sm">Sick Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className="text-sm">Personal Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-200 rounded"></div>
              <span className="text-sm">Emergency Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-200 rounded"></div>
              <span className="text-sm">Pending Approval</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveCalendar;
