
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/types/employee';
import { 
  User, Mail, Phone, MapPin, Calendar, DollarSign, 
  Edit, Trash2, Award, BookOpen, Clock, Target 
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface EmployeeProfileProps {
  employee: Employee;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EmployeeProfile = ({ employee, onEdit, onDelete }: EmployeeProfileProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { hasPermission } = usePermissions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                <p className="text-lg text-gray-600">{employee.position}</p>
                <p className="text-sm text-gray-500">{employee.department}</p>
                <Badge className={`mt-2 ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </Badge>
              </div>
            </div>
            
            {hasPermission('edit_employees') && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {hasPermission('delete_employees') && (
                  <Button variant="outline" onClick={onDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{employee.phone}</span>
                  </div>
                )}
                {employee.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{employee.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {employee.startDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="text-sm font-medium">{new Date(employee.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {employee.salary && hasPermission('view_payroll') && (
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Annual Salary</p>
                      <p className="text-sm font-medium">${employee.salary.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            {employee.skills && employee.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            {employee.address && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p>{employee.address.street}</p>
                    <p>{employee.address.city}, {employee.address.state} {employee.address.zipCode}</p>
                    <p>{employee.address.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contact */}
            {employee.emergencyContact && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{employee.emergencyContact.name}</p>
                    <p>{employee.emergencyContact.phone}</p>
                    <p className="text-gray-600">{employee.emergencyContact.relationship}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="employment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-medium">{employee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{employee.department}</p>
                </div>
                {employee.location && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{employee.location}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certifications */}
            {employee.certifications && employee.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {employee.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">4.2</div>
                  <div className="text-sm text-gray-600">out of 5.0</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Goals Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">8/10</div>
                  <div className="text-sm text-gray-600">this quarter</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">24</div>
                  <div className="text-sm text-gray-600">this year</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
