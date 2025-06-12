
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

  // Empty data arrays - will be populated when real data is available
  const courses: any[] = [];
  const programs: any[] = [];

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
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span>No courses yet</span>
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
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Star className="w-4 h-4 text-gray-400" />
                <span>No certifications</span>
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
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>No learning hours</span>
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
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span>No participants</span>
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
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
                <p className="text-gray-600 mb-6">
                  Learning courses will appear here once you create and add them to the system.
                </p>
                <Button>Create First Course</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Development Programs</CardTitle>
                <CardDescription>Long-term skill development initiatives</CardDescription>
              </CardHeader>
              <CardContent className="p-12 text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No development programs</h3>
                <p className="text-gray-600 mb-6">
                  Development programs will be listed here once you create comprehensive training initiatives.
                </p>
                <Button>Create First Program</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle>Resource Library</CardTitle>
                <CardDescription>Access learning materials and resources</CardDescription>
              </CardHeader>
              <CardContent className="p-12 text-center">
                <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No learning resources</h3>
                <p className="text-gray-600 mb-6">
                  Learning materials and resources will be available here once you upload them.
                </p>
                <Button>Upload Resources</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>Evaluate and track skill development</CardDescription>
              </CardHeader>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No skills assessments</h3>
                <p className="text-gray-600 mb-6">
                  Skills assessments will be displayed here once you create evaluation criteria and conduct assessments.
                </p>
                <Button>Create Assessment</Button>
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
