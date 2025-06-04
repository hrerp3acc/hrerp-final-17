
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Phone, MapPin, Calendar, Building, 
  Award, BookOpen, TrendingUp, FileText, Clock,
  Edit, Download, Upload, MoreVertical
} from 'lucide-react';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock employee data - would come from API
  const employee = {
    id: id || '001',
    name: 'Sarah Johnson',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    startDate: '2021-03-15',
    status: 'Active',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    managerId: '002',
    manager: 'Michael Chen',
    avatar: null,
    performance: {
      currentRating: 4.2,
      goals: 12,
      completedGoals: 8,
      lastReview: '2024-01-15'
    },
    compensation: {
      baseSalary: 95000,
      currency: 'USD',
      lastIncrease: '2023-07-01',
      nextReview: '2024-07-01'
    }
  };

  const personalInfo = [
    { label: 'Employee ID', value: employee.id },
    { label: 'Email', value: employee.email, icon: Mail },
    { label: 'Phone', value: employee.phone, icon: Phone },
    { label: 'Location', value: employee.location, icon: MapPin },
    { label: 'Start Date', value: employee.startDate, icon: Calendar },
    { label: 'Department', value: employee.department, icon: Building }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/employees" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Back to Employee Directory
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Profile
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                  <p className="text-lg text-gray-600">{employee.position}</p>
                  <p className="text-sm text-gray-500">{employee.department}</p>
                </div>
                <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                  {employee.status}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{employee.performance.currentRating}</div>
                  <div className="text-sm text-gray-500">Performance Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{employee.performance.completedGoals}/{employee.performance.goals}</div>
                  <div className="text-sm text-gray-500">Goals Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3.2</div>
                  <div className="text-sm text-gray-500">Years at Company</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-500">Certifications</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {personalInfo.map((info, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {info.icon && <info.icon className="w-4 h-4 text-gray-400" />}
                      <span className="text-sm font-medium text-gray-700">{info.label}</span>
                    </div>
                    <span className="text-sm text-gray-900">{info.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Time Off Balance</span>
                  <span className="text-sm text-gray-900">18.5 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Last Performance Review</span>
                  <span className="text-sm text-gray-900">{employee.performance.lastReview}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Reports To</span>
                  <span className="text-sm text-gray-900">{employee.manager}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Direct Reports</span>
                  <span className="text-sm text-gray-900">3 employees</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Current Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm">Q2 Project Delivery</div>
                    <div className="text-xs text-gray-600 mt-1">Due: Jun 30, 2024</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-sm">Team Mentorship</div>
                    <div className="text-xs text-gray-600 mt-1">Due: Dec 31, 2024</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-sm">Project Leadership Award</div>
                      <div className="text-xs text-gray-600">March 2024</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-sm">Innovation Champion</div>
                      <div className="text-xs text-gray-600">January 2024</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Review History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-sm">Annual Review 2024</div>
                      <Badge variant="outline">4.2/5</Badge>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">January 15, 2024</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-sm">Mid-Year Review 2023</div>
                      <Badge variant="outline">4.0/5</Badge>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">July 15, 2023</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compensation">
          <Card>
            <CardHeader>
              <CardTitle>Compensation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Compensation information requires appropriate permissions to view.</p>
                <Button className="mt-4">Request Access</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Learning & Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Advanced React Development</h4>
                      <p className="text-sm text-gray-600">In Progress - 75% Complete</p>
                    </div>
                    <Badge>In Progress</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Leadership Fundamentals</h4>
                      <p className="text-sm text-gray-600">Completed - February 2024</p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Employee Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">Employment Contract</div>
                      <div className="text-xs text-gray-600">Updated: March 15, 2021</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">Performance Review 2024</div>
                      <div className="text-xs text-gray-600">Updated: January 15, 2024</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Employment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-600 pl-4">
                  <div className="font-medium">Senior Software Engineer</div>
                  <div className="text-sm text-gray-600">Engineering Department</div>
                  <div className="text-xs text-gray-500">July 2023 - Present</div>
                </div>
                <div className="border-l-2 border-gray-300 pl-4">
                  <div className="font-medium">Software Engineer</div>
                  <div className="text-sm text-gray-600">Engineering Department</div>
                  <div className="text-xs text-gray-500">March 2021 - July 2023</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
