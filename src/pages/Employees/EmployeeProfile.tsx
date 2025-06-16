
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import { useToast } from '@/hooks/use-toast';
import EmployeeProfile from '@/components/Employees/EmployeeProfile';
import type { Tables } from '@/integrations/supabase/types';

type Employee = Tables<'employees'>;

const EmployeeProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, departments, deleteEmployee, loading } = useSupabaseEmployees();
  const { toast } = useToast();

  const employee = id ? employees.find(emp => emp.id === id) : null;
  const department = employee ? departments.find(dept => dept.id === employee.department_id) : null;

  // Transform Supabase employee to match the component's expected format
  const transformedEmployee = employee ? {
    id: employee.id,
    name: `${employee.first_name} ${employee.last_name}`,
    email: employee.email,
    phone: employee.phone || '',
    department: department?.name || 'No Department',
    position: employee.position || 'No Position',
    location: employee.location || '',
    status: employee.status as 'active' | 'inactive' | 'terminated',
    avatar: undefined,
    startDate: employee.start_date || '',
    salary: employee.salary || undefined,
    managerId: employee.manager_id || undefined,
    emergencyContact: employee.emergency_contact_name ? {
      name: employee.emergency_contact_name,
      phone: employee.emergency_contact_phone || '',
      relationship: 'Emergency Contact'
    } : undefined,
    address: employee.address ? {
      street: employee.address,
      city: '',
      state: '',
      zipCode: '',
      country: ''
    } : undefined,
    skills: [],
    certifications: [],
    notes: employee.notes || '',
    createdAt: employee.created_at || '',
    updatedAt: employee.updated_at || ''
  } : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!transformedEmployee) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Employee Not Found</h1>
        <p className="text-gray-600 mb-6">The employee you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/employees')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    // In a real app, this would open an edit modal or navigate to edit page
    toast({
      title: "Edit Employee",
      description: "Edit functionality would be implemented here",
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employee.id);
        toast({
          title: "Employee Deleted",
          description: `${transformedEmployee.name} has been removed from the system`,
        });
        navigate('/employees');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete employee",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/employees')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>
      </div>

      {/* Employee Profile Component */}
      <EmployeeProfile 
        employee={transformedEmployee}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EmployeeProfilePage;
