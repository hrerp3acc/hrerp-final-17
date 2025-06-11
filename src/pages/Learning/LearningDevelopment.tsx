
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Award, Clock, Users, TrendingUp, 
  Star, Calendar, CheckCircle, Play, Download
} from 'lucide-react';
import DetailsPanel from '@/components/Common/DetailsPanel';

const LearningDevelopment = () => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const courses = [
    { id: 1, title: "Leadership Fundamentals", instructor: "Sarah Johnson", duration: "6 weeks", enrolled: 24, progress: 85, status: "In Progress", description: "Build essential leadership skills for modern managers" },
    { id: 2, title: "Data Analytics Mastery", instructor: "Michael Chen", duration: "8 weeks", enrolled: 18, progress: 45, status: "Active", description: "Master data analysis tools and techniques" },
    { id: 3, title: "Communication Excellence", instructor: "Emily Davis", duration: "4 weeks", enrolled: 32, progress: 100, status: "Completed", description: "Enhance professional communication skills" },
  ];

  const programs = [
    { id: 1, name: "Management Development Program", participants: 15, duration: "6 months", completion: 67, status: "Active", description: "Comprehensive leadership development program" },
    { id: 2, name: "Technical Skills Bootcamp", participants: 28, duration: "3 months", completion: 89, status: "Active", description: "Intensive technical skills training" },
    { id: 3, name: "Sales Excellence Program", participants: 12, duration: "4 months", completion: 45, status: "Active", description: "Advanced sales methodology training" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Active Courses</span>
              </CardTitle>
              <CardDescription>Currently enrolled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>+3 this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Certifications</span>
              </CardTitle>
              <CardDescription>Completed this year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">47</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Star className="w-4 h-4 text-gold-500" />
                <span>23% increase</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Learning Hours</span>
              </CardTitle>
              <CardDescription>This quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,247</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Avg 15h per employee</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Participants</span>
              </CardTitle>
              <CardDescription>Active learners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">89</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>85% completion rate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList>
            <TabsTrigger value="courses">Learning Courses</TabsTrigger>
            <TabsTrigger value="programs">Development Programs</TabsTrigger>
            <TabsTrigger value="library">Resource Library</TabsTrigger>
            <TabsTrigger value="assessments">Skills Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Learning Courses</span>
                  <Button>Create Course</Button>
                </CardTitle>
                <CardDescription>Manage training courses and content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div 
                      key={course.id} 
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{course.title}</h4>
                        <Badge variant={course.status === "Completed" ? "secondary" : course.status === "In Progress" ? "default" : "outline"}>
                          {course.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">by {course.instructor} • {course.duration}</p>
                      <Progress value={course.progress} className="mb-2" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{course.enrolled} enrolled</span>
                        <span>{course.progress}% complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Development Programs</CardTitle>
                <CardDescription>Long-term skill development initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div 
                      key={program.id} 
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedProgram(program)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{program.name}</h4>
                        <Badge variant="default">{program.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-gray-500">Participants</p>
                          <p className="font-medium">{program.participants}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">{program.duration}</p>
                        </div>
                      </div>
                      <Progress value={program.completion} className="mb-2" />
                      <div className="text-sm text-gray-500">{program.completion}% completion</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle>Resource Library</CardTitle>
                <CardDescription>Access learning materials and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: "Video", title: "Project Management Essentials", duration: "2h 30m", downloads: 156 },
                    { type: "Document", title: "Leadership Best Practices Guide", size: "2.4 MB", downloads: 89 },
                    { type: "Presentation", title: "Data Analysis Techniques", slides: "45 slides", downloads: 203 },
                    { type: "eBook", title: "Communication Mastery", pages: "120 pages", downloads: 67 },
                  ].map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <h4 className="font-medium mb-1">{resource.title}</h4>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{resource.duration || resource.size || resource.slides || resource.pages}</span>
                        <span>{resource.downloads} downloads</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>Evaluate and track skill development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { skill: "Leadership", current: 75, target: 85, assessment: "Quarterly Review" },
                    { skill: "Technical Skills", current: 82, target: 90, assessment: "Peer Evaluation" },
                    { skill: "Communication", current: 90, target: 95, assessment: "360 Feedback" },
                    { skill: "Problem Solving", current: 68, target: 80, assessment: "Case Study" },
                  ].map((assessment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{assessment.skill}</h4>
                        <span className="text-sm text-gray-500">{assessment.current}% → {assessment.target}%</span>
                      </div>
                      <Progress value={assessment.current} className="mb-2" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Assessment: {assessment.assessment}</span>
                        <Button variant="outline" size="sm">Take Assessment</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <DetailsPanel
          title={selectedCourse ? "Course Details" : selectedProgram ? "Program Details" : "Learning Details"}
          isEmpty={!selectedCourse && !selectedProgram}
          emptyMessage="Select a course or program to view detailed information"
        >
          {selectedCourse && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedCourse.title}</h3>
              <p className="text-gray-600">{selectedCourse.description}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-medium">{selectedCourse.instructor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{selectedCourse.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Enrolled Students</p>
                  <p className="font-medium">{selectedCourse.enrolled}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <Progress value={selectedCourse.progress} className="mt-1" />
                  <p className="text-sm font-medium mt-1">{selectedCourse.progress}% complete</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={selectedCourse.status === "Completed" ? "secondary" : selectedCourse.status === "In Progress" ? "default" : "outline"}>
                    {selectedCourse.status}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
                <Button className="w-full" variant="outline">View Materials</Button>
                <Button className="w-full" variant="outline">View Progress</Button>
              </div>
            </div>
          )}
          
          {selectedProgram && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedProgram.name}</h3>
              <p className="text-gray-600">{selectedProgram.description}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Participants</p>
                  <p className="font-medium">{selectedProgram.participants}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{selectedProgram.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <Progress value={selectedProgram.completion} className="mt-1" />
                  <p className="text-sm font-medium mt-1">{selectedProgram.completion}% complete</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant="default">{selectedProgram.status}</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full">View Curriculum</Button>
                <Button className="w-full" variant="outline">Manage Participants</Button>
                <Button className="w-full" variant="outline">Generate Report</Button>
              </div>
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default LearningDevelopment;
