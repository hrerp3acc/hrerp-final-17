
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
import { useSkillsManagement } from '@/hooks/useSkillsManagement';

const SkillManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    skillCategories,
    organizationalSkills,
    skillAssessments,
    trainingPrograms,
    loading,
    getSkillStats
  } = useSkillsManagement();

  const stats = getSkillStats();

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
      case 'active': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter skills based on search and category
  const filteredSkills = organizationalSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category?.name.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Convert assessments to skill data format
  const skillsWithAssessments = filteredSkills.map(skill => {
    const assessments = skillAssessments.filter(assessment => assessment.skill_id === skill.id);
    const avgCurrent = assessments.length > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + a.current_level, 0) / assessments.length)
      : 0;
    const avgTarget = assessments.length > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + a.target_level, 0) / assessments.length)
      : 0;
    
    return {
      id: skill.id,
      name: skill.name,
      category: skill.category?.name || 'Uncategorized',
      currentLevel: avgCurrent,
      targetLevel: avgTarget,
      gap: avgCurrent - avgTarget,
      employees: assessments.length,
      priority: Math.abs(avgCurrent - avgTarget) >= 30 ? 'High' : 
                Math.abs(avgCurrent - avgTarget) >= 15 ? 'Medium' : 'Low'
    };
  });

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
                <p className="text-2xl font-bold">{stats.totalSkills}</p>
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
                <p className="text-2xl font-bold text-red-600">{stats.criticalGaps}</p>
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
                <p className="text-2xl font-bold text-orange-600">{stats.inTraining}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.avgProgress}%</p>
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
                  <SelectItem key={category.id} value={category.name.toLowerCase()}>
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
            {skillsWithAssessments.map((skill) => (
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
              <CardTitle>Training Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingPrograms.map((program) => (
                  <div key={program.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{program.title}</h4>
                        <p className="text-sm text-gray-600">Target skill: {program.skill?.name || 'General'}</p>
                      </div>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Duration</div>
                        <div className="font-medium">{program.duration_hours || 0} hours</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Participants</div>
                        <div className="font-medium">{program.current_participants}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Completion</div>
                        <div className="font-medium">{program.completion_rate}%</div>
                      </div>
                      <div className="flex items-end">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>

                    {program.status === 'active' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${program.completion_rate}%` }}
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
