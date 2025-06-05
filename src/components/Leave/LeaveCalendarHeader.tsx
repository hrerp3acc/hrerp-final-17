
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const LeaveCalendarHeader = () => {
  return (
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
  );
};

export default LeaveCalendarHeader;
