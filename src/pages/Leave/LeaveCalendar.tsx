
import { useState } from 'react';
import LeaveCalendarHeader from '@/components/Leave/LeaveCalendarHeader';
import LeaveCalendarFilters from '@/components/Leave/LeaveCalendarFilters';
import CalendarGrid from '@/components/Leave/CalendarGrid';
import UpcomingLeaves from '@/components/Leave/UpcomingLeaves';
import LeaveCalendarLegend from '@/components/Leave/LeaveCalendarLegend';

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
  const [leaveEvents, setLeaveEvents] = useState<LeaveEvent[]>([]);

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

  return (
    <div className="space-y-6">
      <LeaveCalendarHeader />
      
      <LeaveCalendarFilters
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedLeaveType={selectedLeaveType}
        setSelectedLeaveType={setSelectedLeaveType}
        departments={departments}
        leaveTypes={leaveTypes}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <CalendarGrid
          currentDate={currentDate}
          onNavigateMonth={navigateMonth}
          leaveEvents={leaveEvents}
          selectedDepartment={selectedDepartment}
          selectedLeaveType={selectedLeaveType}
        />
        
        <UpcomingLeaves leaveEvents={leaveEvents} />
      </div>

      <LeaveCalendarLegend />
    </div>
  );
};

export default LeaveCalendar;
