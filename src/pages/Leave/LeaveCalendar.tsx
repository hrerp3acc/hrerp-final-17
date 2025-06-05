
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
