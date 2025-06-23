
import { useState, useEffect } from 'react';
import LeaveCalendarHeader from '@/components/Leave/LeaveCalendarHeader';
import LeaveCalendarFilters from '@/components/Leave/LeaveCalendarFilters';
import CalendarGrid from '@/components/Leave/CalendarGrid';
import UpcomingLeaves from '@/components/Leave/UpcomingLeaves';
import LeaveCalendarLegend from '@/components/Leave/LeaveCalendarLegend';
import { useLeaveManagement } from '@/hooks/useLeaveManagement';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';

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

  const { leaveApplications, loading } = useLeaveManagement();
  const { employees } = useSupabaseEmployees();

  const departments = ['all', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations'];
  const leaveTypes = ['all', 'Annual Leave', 'Sick Leave', 'Personal Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave'];

  useEffect(() => {
    // Transform leave applications to leave events
    const events: LeaveEvent[] = leaveApplications.map(app => {
      const employee = employees.find(emp => emp.id === app.employee_id);
      const employeeName = employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown Employee';
      
      // Get department name (simplified for now)
      const departmentName = employee?.department_id ? 'Department' : 'No Department';

      const formatLeaveType = (type: string) => {
        const typeMap: { [key: string]: string } = {
          annual: 'Annual Leave',
          sick: 'Sick Leave',
          personal: 'Personal Leave',
          emergency: 'Emergency Leave',
          maternity: 'Maternity Leave',
          paternity: 'Paternity Leave'
        };
        return typeMap[type] || type;
      };

      return {
        id: app.id,
        employee: employeeName,
        department: departmentName,
        leaveType: formatLeaveType(app.leave_type),
        startDate: app.start_date,
        endDate: app.end_date,
        status: app.status as 'approved' | 'pending' | 'rejected'
      };
    });

    setLeaveEvents(events);
  }, [leaveApplications, employees]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
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
