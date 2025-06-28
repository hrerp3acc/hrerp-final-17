
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, Users, TrendingUp, AlertCircle, Plus,
  Search, Filter, Target, Award
} from 'lucide-react';

const SkillManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - this would come from your backend
  const skillCategories = [
    { id: 'technical', name: 'Technical Skills', count: 45 },
    { id: 'soft', name: 'Soft Skills', count: 28 },
    { id: 'leadership', name: 'Leadership', count: 15 },
    { id: 'compliance', name: 'Compliance', count: 12 }
  ];

  const skills = [
    {
      id: 1,
      name: 'React Development',
      category: 'Technical',
      currentLevel: 65,
      targetLevel: 85,
      gap: -20,
      employees: 12,
      priority: 'High'
    },
    {
      id: 2,
      name: 'Project Management',
      category: 'Leadership',
      currentLevel: 78,
      targetLevel: 90,
      gap: -12,
      employees: 8,
      priority: 'Medium'
    },
    {
      id: 3,
      name: 'Data Analytics',
      category: 'Technical',
      currentLevel: 45,
      targetLevel: 75,
      gap: -30,
      employees: 15,
      priority: 'High'
    },
    {
      id: 4,
      name: 'Communication',
      category: 'Soft Skills',
      currentLevel: 82,
      targetLevel: 85,
      gap: -3,
      employees: 25,
      priority: 'Low'
    }
  ];

  const trainingPrograms = [
    {
      id: 1,
      title: 'Advanced React Masterclass',
      skill: 'React Development',
      duration: '40 hours',
      participants: 8,
      status: 'Active',
      completion: 65
    },
    {
      id: 2,
      title: 'Leadership Fundamentals',
      skill: 'Project Management',
      duration: '24 hours',
      participants: 12,
      status: 'Planned',
      completion: 0
    },
    {
      id: 3,
      title: 'Data Science Bootcamp',
      skill: 'Data Analytics',
      duration: '60 hours',
      participants: 6,
      status: 'Active',
      completion: 35
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Management</h1>
          <p className="text-gray-600">Identify skill gaps and manage development programs</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Skills</p>
                <p className="text-2xl font-bold">100</p>
                <p className="text-sm text-gray-500">across all categories</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Gaps</p>
                <p className="text-2xl font-bold text-red-600">12</p>
                <p className="text-sm text-gray-500">high priority skills</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Training</p>
                <p className="text-2xl font-bold text-orange-600">45</p>
                <p className="text-sm text-gray-500">employees learning</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-green-600">73%</p>
                <p className="text-sm text-gray-500">toward targets</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">Skill Assessment</TabsTrigger>
          <TabsTrigger value="training">Training Programs</TabsTrigger>
          <TabsTrigger value="matrix">Skill Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {skillCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Skills List */}
          <div className="space-y-4">
            {skills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{skill.name}</h3>
                      <Badge variant="outline">{skill.category}</Badge>
                      <Badge className={getPriorityColor(skill.priority)}>
                        {skill.priority} Priority
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {skill.employees} employees
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Current Level</div>
                      <div className="text-2xl font-bold text-blue-600">{skill.currentLevel}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${skill.currentLevel}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Target Level</div>
                      <div className="text-2xl font-bold text-green-600">{skill.targetLevel}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${skill.targetLevel}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Skill Gap</div>
                      <div className={`text-2xl font-bold ${skill.gap < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {skill.gap}%
                      </div>
                      <Button className="mt-2" size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        Create Training
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Training Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingPrograms.map((program) => (
                  <div key={program.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{program.title}</h4>
                        <p className="text-sm text-gray-600">Target skill: {program.skill}</p>
                      </div>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Duration</div>
                        <div className="font-medium">{program.duration}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Participants</div>
                        <div className="font-medium">{program.participants}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Completion</div>
                        <div className="font-medium">{program.completion}%</div>
                      </div>
                      <div className="flex items-end">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>

                    {program.status === 'Active' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${program.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Skill Matrix Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Skill matrix visualization coming soon...</p>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Configure Matrix
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillManagement;
