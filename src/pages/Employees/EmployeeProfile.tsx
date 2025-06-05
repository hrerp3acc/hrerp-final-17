
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useToast } from '@/hooks/use-toast';
import EmployeeProfile from '@/components/Employees/EmployeeProfile';

const EmployeeProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee, deleteEmployee } = useEmployees();
  const { toast } = useToast();

  const employee = id ? getEmployee(id) : null;

  if (!employee) {
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
          description: `${employee.name} has been removed from the system`,
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
        employee={employee}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EmployeeProfilePage;
