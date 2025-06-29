
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Target, TrendingUp, AlertTriangle, Plus,
  Calendar, BarChart3, Settings
} from 'lucide-react';
import { useWorkforcePlanning } from '@/hooks/useWorkforcePlanning';

const WorkforcePlanning = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [planningHorizon, setPlanningHorizon] = useState('12months');

  const {
    capacityData,
    workforcePlans,
    skillGaps,
    loading,
    getWorkforceStats
  } = useWorkforcePlanning();

  const stats = getWorkforceStats();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold text-red-600">-{stats.totalCapacityGap}</p>
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
                <p className="text-2xl font-bold text-orange-600">{stats.openPositions}</p>
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
                <p className="text-2xl font-bold text-blue-600">{stats.criticalSkillGaps}</p>
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
                <p className="text-sm text-gray-600">High Risk Roles</p>
                <p className="text-2xl font-bold text-purple-600">{stats.highRiskRoles}</p>
                <p className="text-sm text-gray-500">priority positions</p>
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
                {capacityData.map((dept) => (
                  <div key={dept.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{dept.department?.name || 'Unknown Department'}</h4>
                        <Badge className={getPriorityColor(dept.priority)}>
                          {dept.priority} Priority
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {dept.open_positions} open positions
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Current</div>
                        <div className="font-medium">{dept.current_headcount} people</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Planned</div>
                        <div className="font-medium">{dept.planned_headcount} people</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Capacity</div>
                        <div className="font-medium">{dept.capacity_headcount} people</div>
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
                        <span>{dept.capacity_headcount > 0 ? Math.round((dept.current_headcount / dept.capacity_headcount) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${dept.capacity_headcount > 0 ? (dept.current_headcount / dept.capacity_headcount) * 100 : 0}%` }}
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
                {skillGaps.slice(0, 10).map((skill, index) => (
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
          <Card>
            <CardHeader>
              <CardTitle>Succession Planning Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Succession planning data will be displayed here...</p>
                <Button className="mt-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Succession Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
