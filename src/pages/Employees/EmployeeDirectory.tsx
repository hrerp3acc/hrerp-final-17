
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, Mail, Phone, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import DetailsPanel from '@/components/Common/DetailsPanel';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/types/employee';

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { employees, getDepartments } = useEmployees();
  const departments = ['all', ...getDepartments()];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleViewProfile = (employeeId: string) => {
    console.log('Viewing profile for employee:', employeeId);
    window.location.href = `/employees/${employeeId}`;
  };

  const handleEditEmployee = (employeeId: string) => {
    console.log('Editing employee:', employeeId);
    alert(`Edit functionality for employee ${employeeId} would be implemented here`);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
            <p className="text-gray-600">Manage and view all employees in your organization</p>
          </div>
          <Link to="/employees/add">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Employee Grid */}
        {filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEmployees.map((employee) => (
              <div 
                key={employee.id} 
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleEmployeeSelect(employee)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-lg">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    employee.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{employee.email}</span>
                  </div>
                  {employee.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{employee.department}</span>
                  {employee.location && <span className="text-gray-600">{employee.location}</span>}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(employee.id);
                    }}
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEmployee(employee.id);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedDepartment !== 'all' 
                ? 'No employees match your current filters. Try adjusting your search or filters.' 
                : 'Get started by adding your first employee to the directory.'}
            </p>
            <Link to="/employees/add">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Employee
              </Button>
            </Link>
          </div>
        )}

        {/* Results Summary */}
        {filteredEmployees.length > 0 && (
          <div className="text-center text-gray-600">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        )}
      </div>

      <div>
        <DetailsPanel
          title="Employee Details"
          isEmpty={!selectedEmployee}
          emptyMessage="Select an employee to view their detailed information"
        >
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xl">
                    {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-gray-600">{selectedEmployee.position}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedEmployee.department}</p>
                </div>
                {selectedEmployee.location && (
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{selectedEmployee.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedEmployee.email}</p>
                </div>
                {selectedEmployee.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedEmployee.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedEmployee.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full" onClick={() => handleViewProfile(selectedEmployee.id)}>
                  View Full Profile
                </Button>
                <Button className="w-full" variant="outline" onClick={() => handleEditEmployee(selectedEmployee.id)}>
                  Edit Employee
                </Button>
              </div>
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default EmployeeDirectory;
