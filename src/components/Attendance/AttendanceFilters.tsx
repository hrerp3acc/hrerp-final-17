
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Calendar } from 'lucide-react';

interface AttendanceFiltersProps {
  dateRange: {
    start: string;
    end: string;
  };
  onDateRangeChange: (dateRange: { start: string; end: string }) => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const AttendanceFilters = ({
  dateRange,
  onDateRangeChange,
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  searchTerm = '',
  onSearchChange
}: AttendanceFiltersProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="start_date"
              type="date"
              value={dateRange.start}
              onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="end_date">End Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="end_date"
              type="date"
              value={dateRange.end}
              onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="hr">Human Resources</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status Filter</Label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {onSearchChange && (
          <div className="md:col-span-4">
            <Label htmlFor="search">Search Employees</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by name or department..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceFilters;
