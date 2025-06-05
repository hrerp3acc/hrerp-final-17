
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface AttendanceEvent {
  date: Date;
  status: 'present' | 'absent' | 'leave' | 'weekend' | 'holiday';
  timeSpent: string;
  inTime: string;
  outTime: string;
  shiftName: string;
  shiftTiming: string;
  employeeId: string;
  productiveTime?: string;
  nonProductiveTime?: string;
  otHours?: string;
}

const LeaveAttendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<AttendanceEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');

  // Sample attendance data
  const attendanceData: AttendanceEvent[] = [
    {
      date: new Date(2025, 5, 1), // June 1st
      status: 'leave',
      timeSpent: '00:00',
      inTime: '10:14',
      outTime: '10:14',
      shiftName: 'G',
      shiftTiming: '9:30AM - 6:30PM',
      employeeId: 'KPS00133'
    },
    {
      date: new Date(2025, 5, 2),
      status: 'present',
      timeSpent: '08:30',
      inTime: '09:15',
      outTime: '18:00',
      shiftName: 'G',
      shiftTiming: '9:30AM - 6:30PM',
      employeeId: 'KPS00133',
      productiveTime: '07:45',
      nonProductiveTime: '00:45'
    },
    {
      date: new Date(2025, 5, 5),
      status: 'absent',
      timeSpent: '00:00',
      inTime: '10:14',
      outTime: '10:14',
      shiftName: 'G',
      shiftTiming: '9:30AM - 6:30PM',
      employeeId: 'KPS00133'
    }
  ];

  const attendanceStats = {
    totalDays: 5,
    physicalPresentDays: 2.5,
    weeklyOffs: 1,
    leaves: 0,
    holidays: 0,
    absents: 1.5,
    paidDays: 3.5,
    lateCount: 0,
    earlyGoingCount: 0,
    lateDeductionLeaves: 0,
    overTimeHours: '',
    lateHours: '',
    earlyGoingHours: '',
    coff: 0
  };

  const getEventForDate = (date: Date) => {
    return attendanceData.find(event => isSameDay(event.date, date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'leave':
        return 'bg-yellow-500';
      case 'weekend':
        return 'bg-blue-500';
      case 'holiday':
        return 'bg-purple-500';
      default:
        return 'bg-gray-300';
    }
  };

  const renderCalendarDay = (date: Date) => {
    const event = getEventForDate(date);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let status = 'present';
    if (event) {
      status = event.status;
    } else if (isWeekend) {
      status = 'weekend';
    }

    return (
      <div
        className={`relative w-full h-20 border border-gray-200 cursor-pointer hover:bg-gray-50 ${getStatusColor(status)} bg-opacity-10`}
        onClick={() => event && setSelectedEvent(event)}
      >
        <div className="p-2">
          <div className="text-sm font-medium">{format(date, 'd')}</div>
          {event && (
            <div className="mt-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} mb-1`}></div>
              <div className="text-xs text-gray-600">{event.shiftName}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const generateCalendarGrid = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Add empty cells for days before month start
    const startDay = start.getDay();
    const emptyCells = Array(startDay).fill(null);
    
    return [...emptyCells, ...days];
  };

  if (activeTab === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Welcome MOHANAVEL R</h1>
              <p className="text-lg text-blue-500">Good Morning</p>
              <p className="text-gray-600 mt-2">
                Great to see you again! Thanks for trusting our HRM platform to keep your work organized and hassle-free. Let's make today another productive one!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-100 hover:bg-blue-200"
              onClick={() => setActiveTab('calendar')}
            >
              <Clock className="w-6 h-6" />
              <span>Attendance</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-100 hover:bg-purple-200"
              onClick={() => setActiveTab('calendar')}
            >
              <CheckCircle className="w-6 h-6" />
              <span>Leave & Attendance</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Tabs */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setActiveTab('welcome')}
                className="text-sm"
              >
                ← Back to Welcome
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                All, Shifts, WeeklyOff, S...
              </Button>
              <Button variant="outline" size="sm" className="bg-yellow-400 text-black">
                <Download className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-8 border-b">
            {['Calendar', 'Shift Summary', 'Leave Balances', 'C-off History', 'Incident History'].map((tab) => (
              <button
                key={tab}
                className={`pb-2 px-1 text-sm font-medium border-b-2 ${
                  tab === 'Calendar' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Attendance Period Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800">Attendance Period 01-Jun-2025-05-Jun-2025</h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-blue-600 font-semibold">Total Days: {attendanceStats.totalDays}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-green-600 font-semibold">Physical Present Days: {attendanceStats.physicalPresentDays}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-purple-600 font-semibold">Weekly offs: {attendanceStats.weeklyOffs}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-yellow-600 font-semibold">Leaves: {attendanceStats.leaves}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-orange-600 font-semibold">Holidays: {attendanceStats.holidays}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-red-600 font-semibold">Absents: {attendanceStats.absents}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-green-600 font-semibold">Paid Days: {attendanceStats.paidDays}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600">No. of Late: {attendanceStats.lateCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600">No. of Early Going: {attendanceStats.earlyGoingCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600">Late Deduction Leaves: {attendanceStats.lateDeductionLeaves}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600">Over Time Hours:</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600">Late Hours:</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600">Early Going Hours:</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600">Coff: {attendanceStats.coff}</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">June 2025</h3>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Today</Button>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200">
            {/* Header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 bg-gray-50 border-b border-gray-200 text-center font-medium">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {generateCalendarGrid().map((date, index) => (
              <div key={index} className="border-b border-r border-gray-200">
                {date ? renderCalendarDay(date) : <div className="h-20"></div>}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Weekend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Events</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex space-x-8 border-b">
                {['Details', 'Swipes', 'Leave', 'Incident', 'Summary'].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-2 px-1 text-sm font-medium border-b-2 ${
                      tab === 'Details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Event Header */}
              <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="font-medium">{format(selectedEvent.date, 'dd-MMM-yyyy')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    G 9:30AM - 6:30PM
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">Status: {selectedEvent.status}</div>
                  <div className="text-sm text-gray-600">Time Spent:</div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee ID</span>
                    <span className="font-medium">{selectedEvent.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shift (Name)</span>
                    <span className="font-medium">{selectedEvent.shiftName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shift (Timing & Hours)</span>
                    <span className="font-medium">{selectedEvent.shiftTiming}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">In Time</span>
                    <span className="font-medium">{selectedEvent.inTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Out Time</span>
                    <span className="font-medium">{selectedEvent.outTime}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Time Spent</span>
                    <span className="font-medium">{selectedEvent.timeSpent}</span>
                  </div>
                  {selectedEvent.productiveTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Productive Time Spent</span>
                      <span className="font-medium">{selectedEvent.productiveTime}</span>
                    </div>
                  )}
                  {selectedEvent.nonProductiveTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Non Productive Time Spent</span>
                      <span className="font-medium">{selectedEvent.nonProductiveTime}</span>
                    </div>
                  )}
                  {selectedEvent.otHours && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">OT Hours</span>
                      <span className="font-medium">{selectedEvent.otHours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveAttendance;
