
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Target, TrendingUp, AlertTriangle, Plus,
  Calendar, BarChart3, Settings, Search
} from 'lucide-react';

const WorkforcePlanning = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [planningHorizon, setPlanningHorizon] = useState('12months');

  const capacityData = [
    {
      department: 'Engineering',
      current: 85,
      planned: 95,
      capacity: 100,
      gap: -10,
      priority: 'High',
      openings: 8
    },
    {
      department: 'Sales',
      current: 72,
      planned: 80,
      capacity: 85,
      gap: -8,
      priority: 'Medium',
      openings: 5
    },
    {
      department: 'Marketing',
      current: 35,
      planned: 40,
      capacity: 45,
      gap: -5,
      priority: 'Low',
      openings: 3
    },
    {
      department: 'HR',
      current: 28,
      planned: 30,
      capacity: 32,
      gap: -2,
      priority: 'Low',
      openings: 2
    }
  ];

  const upcomingRetirements = [
    { name: 'Robert Johnson', position: 'Senior Engineer', department: 'Engineering', retirementDate: '2024-12-15', criticality: 'High' },
    { name: 'Mary Williams', position: 'Sales Director', department: 'Sales', retirementDate: '2025-03-20', criticality: 'High' },
    { name: 'David Brown', position: 'Marketing Manager', department: 'Marketing', retirementDate: '2025-06-10', criticality: 'Medium' }
  ];

  const skillGaps = [
    { skill: 'React Development', currentLevel: 65, requiredLevel: 85, gap: -20, department: 'Engineering' },
    { skill: 'Data Analytics', currentLevel: 45, requiredLevel: 75, gap: -30, department: 'Marketing' },
    { skill: 'Cloud Architecture', currentLevel: 55, requiredLevel: 80, gap: -25, department: 'Engineering' },
    { skill: 'Digital Marketing', currentLevel: 70, requiredLevel: 85, gap: -15, department: 'Marketing' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workforce Planning</h1>
          <p className="text-gray-600">Strategic workforce capacity and skill planning</p>
        </div>
        <div className="flex space-x-3">
          <Select value={planningHorizon} onValueChange={setPlanningHorizon}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="12months">12 Months</SelectItem>
              <SelectItem value="24months">24 Months</SelectItem>
              <SelectItem value="36months">36 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Capacity Gap</p>
                <p className="text-2xl font-bold text-red-600">-25</p>
                <p className="text-sm text-gray-500">positions needed</p>
              </div>
              <Users className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Positions</p>
                <p className="text-2xl font-bold text-orange-600">18</p>
                <p className="text-sm text-gray-500">actively recruiting</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Skill Gaps</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-500">critical skills</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Succession Risk</p>
                <p className="text-2xl font-bold text-purple-600">7</p>
                <p className="text-sm text-gray-500">high-risk roles</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning Tabs */}
      <Tabs defaultValue="capacity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
          <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
          <TabsTrigger value="succession">Succession Planning</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="capacity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Capacity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capacityData.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{dept.department}</h4>
                        <Badge className={getPriorityColor(dept.priority)}>
                          {dept.priority} Priority
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {dept.openings} open positions
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Current</div>
                        <div className="font-medium">{dept.current} people</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Planned</div>
                        <div className="font-medium">{dept.planned} people</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Capacity</div>
                        <div className="font-medium">{dept.capacity} people</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Gap</div>
                        <div className={`font-medium ${dept.gap < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {dept.gap} people
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Current Utilization</span>
                        <span>{Math.round((dept.current / dept.capacity) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(dept.current / dept.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Critical Skill Gaps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGaps.map((skill, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{skill.skill}</h4>
                        <p className="text-sm text-gray-600">{skill.department}</p>
                      </div>
                      <Badge variant="outline" className="text-red-600">
                        {skill.gap} gap
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Level: {skill.currentLevel}%</span>
                        <span>Required: {skill.requiredLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${skill.currentLevel}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="succession" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Retirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingRetirements.map((retirement, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{retirement.name}</h4>
                          <p className="text-sm text-gray-600">{retirement.position}</p>
                          <p className="text-xs text-gray-500">{retirement.department}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getPriorityColor(retirement.criticality)}>
                            {retirement.criticality}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{retirement.retirementDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Succession Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Ready Now</span>
                      <Badge className="bg-green-100 text-green-800">23%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">1-2 Years</span>
                      <Badge className="bg-yellow-100 text-yellow-800">45%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">No Successor</span>
                      <Badge className="bg-red-100 text-red-800">32%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Scenario planning and modeling tools coming soon...</p>
                <Button className="mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Scenarios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkforcePlanning;
