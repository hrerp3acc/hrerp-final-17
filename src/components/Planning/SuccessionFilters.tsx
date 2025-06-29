
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SuccessionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
}

const SuccessionFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedDepartment, 
  setSelectedDepartment 
}: SuccessionFiltersProps) => {
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SuccessionFilters;
