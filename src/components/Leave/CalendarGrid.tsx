
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LeaveEvent {
  id: string;
  employee: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface CalendarGridProps {
  currentDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  leaveEvents: LeaveEvent[];
  selectedDepartment: string;
  selectedLeaveType: string;
}

const CalendarGrid = ({
  currentDate,
  onNavigateMonth,
  leaveEvents,
  selectedDepartment,
  selectedLeaveType
}: CalendarGridProps) => {
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

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onNavigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigateMonth('next')}>
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
  );
};

export default CalendarGrid;
