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
import { useSuccessionPlanning } from '@/hooks/useSuccessionPlanning';

const SuccessionPlanning = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    keyPositions,
    successors,
    developmentPlans,
    loading,
    getSuccessionStats
  } = useSuccessionPlanning();

  const stats = getSuccessionStats();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
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

  // Calculate months until retirement
  const getMonthsUntilRetirement = (retirementDate: string | null) => {
    if (!retirementDate) return 'N/A';
    const months = Math.floor((new Date(retirementDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months > 0 ? `${months} months` : 'Overdue';
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
                <p className="text-2xl font-bold">{stats.totalPositions}</p>
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
                <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.readySuccessors}</p>
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
                <p className="text-2xl font-bold text-orange-600">{stats.inDevelopment}</p>
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
              </SelectContent>
            </Select>
          </div>

          {/* Key Positions List */}
          <div className="space-y-4">
            {keyPositions.map((position) => {
              const readySuccessors = successors.filter(s => 
                s.key_position_id === position.id && s.readiness_level === 'Ready Now'
              ).length;
              const developingSuccessors = successors.filter(s => 
                s.key_position_id === position.id && s.readiness_level !== 'Ready Now'
              ).length;

              return (
                <Card key={position.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-lg">{position.title}</h3>
                        <Badge variant="outline">{position.department?.name || 'No Department'}</Badge>
                        <Badge className={getCriticalityColor(position.criticality)}>
                          {position.criticality}
                        </Badge>
                        <Badge className={getRiskColor(position.risk_level)}>
                          {position.risk_level} Risk
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Current Holder</div>
                        <div className="font-medium">
                          {position.current_holder ? 
                            `${position.current_holder.first_name} ${position.current_holder.last_name}` : 
                            'Vacant'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Ready Successors</div>
                        <div className="font-medium text-green-600">{readySuccessors}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">In Development</div>
                        <div className="font-medium text-blue-600">{developingSuccessors}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Retirement Date</div>
                        <div className="font-medium">
                          {position.retirement_date || 'Not set'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {getMonthsUntilRetirement(position.retirement_date)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
                          <h4 className="font-semibold">
                            {successor.employee ? 
                              `${successor.employee.first_name} ${successor.employee.last_name}` : 
                              'Unknown Employee'
                            }
                          </h4>
                          <p className="text-sm text-gray-600">
                            {successor.employee?.position || 'Position not set'}
                          </p>
                        </div>
                      </div>
                      <Badge className={getReadinessColor(successor.readiness_level)}>
                        {successor.readiness_level}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Target Role</div>
                        <div className="font-medium">{successor.key_position?.title || 'Not set'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Development Progress</div>
                        <div className="font-medium">{successor.development_progress}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${successor.development_progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Readiness</div>
                        <div className="font-medium">{successor.readiness_level}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Last Assessment</div>
                        <div className="font-medium">
                          {successor.last_assessment_date || 'Not assessed'}
                        </div>
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
                        <h4 className="font-semibold">
                          {plan.candidate?.employee ? 
                            `${plan.candidate.employee.first_name} ${plan.candidate.employee.last_name}` : 
                            'Unknown Candidate'
                          }
                        </h4>
                        <p className="text-sm text-gray-600">Target: {plan.target_position}</p>
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
                        <span className="font-medium">{plan.timeline || 'Not set'}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Next Review: </span>
                        <span className="font-medium">{plan.next_review_date || 'Not scheduled'}</span>
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
