
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, AlertTriangle, Clock, TrendingUp, Plus,
  Search, User, Calendar, Target
} from 'lucide-react';

const SuccessionPlanning = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - this would come from your backend
  const keyPositions = [
    {
      id: 1,
      title: 'Chief Technology Officer',
      department: 'Engineering',
      currentHolder: 'Sarah Johnson',
      riskLevel: 'High',
      readySuccessors: 1,
      developingSuccessors: 2,
      retirementDate: '2025-06-15',
      criticality: 'Critical'
    },
    {
      id: 2,
      title: 'Sales Director',
      department: 'Sales',
      currentHolder: 'Michael Chen',
      riskLevel: 'Medium',
      readySuccessors: 2,
      developingSuccessors: 1,
      retirementDate: '2026-12-20',
      criticality: 'High'
    },
    {
      id: 3,
      title: 'Marketing Manager',
      department: 'Marketing',
      currentHolder: 'Emily Davis',
      riskLevel: 'Low',
      readySuccessors: 1,
      developingSuccessors: 3,
      retirementDate: '2027-08-10',
      criticality: 'Medium'
    },
    {
      id: 4,
      title: 'HR Director',
      department: 'Human Resources',
      currentHolder: 'Robert Wilson',
      riskLevel: 'High',
      readySuccessors: 0,
      developingSuccessors: 1,
      retirementDate: '2024-11-30',
      criticality: 'Critical'
    }
  ];

  const successors = [
    {
      id: 1,
      name: 'David Thompson',
      currentRole: 'Senior Engineering Manager',
      targetRole: 'Chief Technology Officer',
      readiness: 'Ready Now',
      development: 85,
      timeline: 'Immediate',
      lastAssessment: '2024-01-15'
    },
    {
      id: 2,
      name: 'Lisa Rodriguez',
      currentRole: 'Senior Sales Manager',
      targetRole: 'Sales Director',
      readiness: '1-2 Years',
      development: 72,
      timeline: '18 months',
      lastAssessment: '2024-01-10'
    },
    {
      id: 3,
      name: 'James Park',
      currentRole: 'Marketing Specialist',
      targetRole: 'Marketing Manager',
      readiness: 'Ready Now',
      development: 90,
      timeline: '6 months',
      lastAssessment: '2024-01-20'
    }
  ];

  const developmentPlans = [
    {
      id: 1,
      successor: 'Lisa Rodriguez',
      targetRole: 'Sales Director',
      activities: [
        'Executive Leadership Program',
        'Strategic Planning Workshop',
        'Mentoring with Current Director'
      ],
      progress: 65,
      timeline: '12 months',
      nextReview: '2024-03-15'
    },
    {
      id: 2,
      successor: 'Mark Johnson',
      targetRole: 'HR Director',
      activities: [
        'HR Analytics Certification',
        'Change Management Training',
        'Cross-functional Project Lead'
      ],
      progress: 40,
      timeline: '18 months',
      nextReview: '2024-02-28'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'Ready Now': return 'bg-green-100 text-green-800';
      case '1-2 Years': return 'bg-yellow-100 text-yellow-800';
      case '2+ Years': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Succession Planning</h1>
          <p className="text-gray-600">Plan for leadership continuity and talent development</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Position
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Key Positions</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-gray-500">tracked roles</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">7</p>
                <p className="text-sm text-gray-500">positions at risk</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready Successors</p>
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-sm text-gray-500">ready now</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Development</p>
                <p className="text-2xl font-bold text-orange-600">18</p>
                <p className="text-sm text-gray-500">being developed</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="positions">Key Positions</TabsTrigger>
          <TabsTrigger value="successors">Successor Pipeline</TabsTrigger>
          <TabsTrigger value="development">Development Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-6">
          {/* Filters */}
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
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Positions List */}
          <div className="space-y-4">
            {keyPositions.map((position) => (
              <Card key={position.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{position.title}</h3>
                      <Badge variant="outline">{position.department}</Badge>
                      <Badge className={getCriticalityColor(position.criticality)}>
                        {position.criticality}
                      </Badge>
                      <Badge className={getRiskColor(position.riskLevel)}>
                        {position.riskLevel} Risk
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">Current Holder</div>
                      <div className="font-medium">{position.currentHolder}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Ready Successors</div>
                      <div className="font-medium text-green-600">{position.readySuccessors}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">In Development</div>
                      <div className="font-medium text-blue-600">{position.developingSuccessors}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Retirement Date</div>
                      <div className="font-medium">{position.retirementDate}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {Math.floor((new Date(position.retirementDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="successors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Successor Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {successors.map((successor) => (
                  <div key={successor.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-semibold">{successor.name}</h4>
                          <p className="text-sm text-gray-600">{successor.currentRole}</p>
                        </div>
                      </div>
                      <Badge className={getReadinessColor(successor.readiness)}>
                        {successor.readiness}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Target Role</div>
                        <div className="font-medium">{successor.targetRole}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Development Progress</div>
                        <div className="font-medium">{successor.development}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${successor.development}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Timeline</div>
                        <div className="font-medium">{successor.timeline}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Last Assessment</div>
                        <div className="font-medium">{successor.lastAssessment}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Development Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {developmentPlans.map((plan) => (
                  <div key={plan.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{plan.successor}</h4>
                        <p className="text-sm text-gray-600">Target: {plan.targetRole}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Progress</div>
                        <div className="font-semibold">{plan.progress}%</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Development Activities</div>
                      <div className="space-y-1">
                        {plan.activities.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-sm">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-600">Timeline: </span>
                        <span className="font-medium">{plan.timeline}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Next Review: </span>
                        <span className="font-medium">{plan.nextReview}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuccessionPlanning;
