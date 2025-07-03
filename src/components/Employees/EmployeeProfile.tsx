
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Building } from 'lucide-react';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import DocumentsTab from '@/components/Employee/DocumentsTab';
import EmployeeHistory from '@/components/Employee/EmployeeHistory';
import EmployeeNotes from '@/components/Employee/EmployeeNotes';
import type { Tables } from '@/integrations/supabase/types';

type Employee = Tables<'employees'>;

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { getEmployee, departments } = useSupabaseEmployees();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (id) {
      const emp = getEmployee(id);
      setEmployee(emp || null);
    }
  }, [id, getEmployee]);

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Employee not found</p>
      </div>
    );
  }

  const department = departments.find(d => d.id === employee.department_id);

  return (
    <div className="space-y-6">
      {/* Employee Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {employee.first_name} {employee.last_name}
                  </h1>
                  <p className="text-gray-600">{employee.position || 'No position assigned'}</p>
                </div>
                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                  {employee.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{employee.phone}</span>
                  </div>
                )}
                {employee.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{employee.location}</span>
                  </div>
                )}
                {department && (
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{department.name}</span>
                  </div>
                )}
                {employee.start_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Started {new Date(employee.start_date).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">ID:</span>
                  <span className="text-sm">{employee.employee_id}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p>{employee.first_name} {employee.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p>{employee.email}</p>
                </div>
                {employee.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p>{employee.phone}</p>
                  </div>
                )}
                {employee.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p>{employee.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee ID</label>
                  <p>{employee.employee_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Position</label>
                  <p>{employee.position || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p>{department?.name || 'Not assigned'}</p>
                </div>
                {employee.start_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Start Date</label>
                    <p>{new Date(employee.start_date).toLocaleDateString()}</p>
                  </div>
                )}
                {employee.salary && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Salary</label>
                    <p>${employee.salary.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contact */}
          {(employee.emergency_contact_name || employee.emergency_contact_phone) && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.emergency_contact_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p>{employee.emergency_contact_name}</p>
                  </div>
                )}
                {employee.emergency_contact_phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p>{employee.emergency_contact_phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {employee.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{employee.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab employeeId={employee.id} />
        </TabsContent>

        <TabsContent value="notes">
          <EmployeeNotes employeeId={employee.id} />
        </TabsContent>

        <TabsContent value="history">
          <EmployeeHistory employeeId={employee.id} />
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Performance management features coming soon</p>
                <p className="text-sm text-gray-400">This will include goals, reviews, and development plans</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
