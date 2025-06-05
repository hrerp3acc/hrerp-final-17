
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
        return 'bg-emerald-500';
      case 'absent':
        return 'bg-rose-500';
      case 'leave':
        return 'bg-amber-500';
      case 'weekend':
        return 'bg-indigo-500';
      case 'holiday':
        return 'bg-purple-500';
      default:
        return 'bg-slate-400';
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
        className={`relative w-full h-20 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all duration-200 ${getStatusColor(status)} bg-opacity-10 rounded-lg`}
        onClick={() => event && setSelectedEvent(event)}
      >
        <div className="p-3">
          <div className="text-sm font-semibold text-slate-700">{format(date, 'd')}</div>
          {event && (
            <div className="mt-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} mb-1`}></div>
              <div className="text-xs text-slate-600 font-medium">{event.shiftName}</div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-slate-200">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome MOHANAVEL R
              </h1>
              <p className="text-xl text-indigo-500 font-medium">Good Morning</p>
              <p className="text-slate-600 mt-3 max-w-2xl">
                Great to see you again! Thanks for trusting our HRM platform to keep your work organized and hassle-free. Let's make today another productive one!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Links</h3>
          <div className="grid grid-cols-2 gap-6">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border-indigo-200 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => setActiveTab('calendar')}
            >
              <Clock className="w-8 h-8 text-indigo-600" />
              <span className="font-semibold text-indigo-700">Attendance</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => setActiveTab('calendar')}
            >
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <span className="font-semibold text-purple-700">Leave & Attendance</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Tabs */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setActiveTab('welcome')}
                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                ← Back to Welcome
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:border-indigo-400 hover:text-indigo-600">
                <Filter className="w-4 h-4 mr-2" />
                All, Shifts, WeeklyOff, S...
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md">
                <Download className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-8 border-b border-slate-200">
            {['Calendar', 'Shift Summary', 'Leave Balances', 'C-off History', 'Incident History'].map((tab) => (
              <button
                key={tab}
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'Calendar' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Attendance Period Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-8 border border-indigo-200">
          <h3 className="font-bold text-indigo-800 text-lg">Attendance Period 01-Jun-2025-05-Jun-2025</h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-indigo-600 font-bold text-lg">Total Days: {attendanceStats.totalDays}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-emerald-600 font-bold text-lg">Physical Present Days: {attendanceStats.physicalPresentDays}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-purple-600 font-bold text-lg">Weekly offs: {attendanceStats.weeklyOffs}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-amber-600 font-bold text-lg">Leaves: {attendanceStats.leaves}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-orange-600 font-bold text-lg">Holidays: {attendanceStats.holidays}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-rose-600 font-bold text-lg">Absents: {attendanceStats.absents}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-emerald-600 font-bold text-lg">Paid Days: {attendanceStats.paidDays}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-slate-600 font-semibold">No. of Late: {attendanceStats.lateCount}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-slate-600 font-semibold">No. of Early Going: {attendanceStats.earlyGoingCount}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-slate-600 font-semibold">Late Deduction Leaves: {attendanceStats.lateDeductionLeaves}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-slate-600 font-semibold">Over Time Hours:</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-slate-600 font-semibold">Late Hours:</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-slate-600 font-semibold">Early Going Hours:</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="text-slate-600 font-semibold">Coff: {attendanceStats.coff}</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-800">June 2025</h3>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-slate-300 hover:border-indigo-400 hover:text-indigo-600">Today</Button>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 border border-slate-200 rounded-lg overflow-hidden">
            {/* Header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-4 bg-slate-100 border-b border-slate-200 text-center font-bold text-slate-700">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {generateCalendarGrid().map((date, index) => (
              <div key={index} className="border-b border-r border-slate-200 last:border-r-0">
                {date ? renderCalendarDay(date) : <div className="h-20"></div>}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-slate-700">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-rose-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-slate-700">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-slate-700">Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-slate-700">Weekend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Events</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-8">
              <div className="flex space-x-8 border-b border-slate-200">
                {['Details', 'Swipes', 'Leave', 'Incident', 'Summary'].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                      tab === 'Details' 
                        ? 'border-indigo-500 text-indigo-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Event Header */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                    <span className="font-bold text-slate-800">{format(selectedEvent.date, 'dd-MMM-yyyy')}</span>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    G 9:30AM - 6:30PM
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">Status: {selectedEvent.status}</div>
                  <div className="text-sm text-slate-600">Time Spent:</div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Employee ID</span>
                    <span className="font-bold text-slate-800">{selectedEvent.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Shift (Name)</span>
                    <span className="font-bold text-slate-800">{selectedEvent.shiftName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Shift (Timing & Hours)</span>
                    <span className="font-bold text-slate-800">{selectedEvent.shiftTiming}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">In Time</span>
                    <span className="font-bold text-slate-800">{selectedEvent.inTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Out Time</span>
                    <span className="font-bold text-slate-800">{selectedEvent.outTime}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Total Time Spent</span>
                    <span className="font-bold text-slate-800">{selectedEvent.timeSpent}</span>
                  </div>
                  {selectedEvent.productiveTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Productive Time Spent</span>
                      <span className="font-bold text-slate-800">{selectedEvent.productiveTime}</span>
                    </div>
                  )}
                  {selectedEvent.nonProductiveTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Non Productive Time Spent</span>
                      <span className="font-bold text-slate-800">{selectedEvent.nonProductiveTime}</span>
                    </div>
                  )}
                  {selectedEvent.otHours && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">OT Hours</span>
                      <span className="font-bold text-slate-800">{selectedEvent.otHours}</span>
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
