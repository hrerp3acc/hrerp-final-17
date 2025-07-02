
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationInput from '@/components/ui/LocationInput';

interface Department {
  id: string;
  name: string;
}

interface EmploymentDetailsFormProps {
  formData: {
    employeeId: string;
    departmentId: string;
    position: string;
    location: string;
    startDate: string;
    salary: string;
  };
  departments: Department[];
  onInputChange: (field: string, value: string) => void;
}

const EmploymentDetailsForm = ({ formData, departments, onInputChange }: EmploymentDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            value={formData.employeeId}
            onChange={(e) => onInputChange('employeeId', e.target.value)}
            placeholder="Auto-generated if empty"
          />
        </div>

        <div>
          <Label htmlFor="department">Department *</Label>
          <Select value={formData.departmentId} onValueChange={(value) => onInputChange('departmentId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => onInputChange('position', e.target.value)}
            placeholder="Software Engineer"
          />
        </div>

        <LocationInput
          id="location"
          value={formData.location}
          onValueChange={(value) => onInputChange('location', value)}
        />

        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => onInputChange('startDate', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="salary">Annual Salary</Label>
          <Input
            id="salary"
            type="number"
            value={formData.salary}
            onChange={(e) => onInputChange('salary', e.target.value)}
            placeholder="65000"
            min="0"
            step="0.01"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmploymentDetailsForm;
