
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
import { useLearningDevelopment } from '@/hooks/useLearningDevelopment';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;
type CourseEnrollment = Tables<'course_enrollments'> & {
  courses?: Course;
};

const LearningDevelopment = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<CourseEnrollment | null>(null);
  
  const { 
    courses, 
    enrollments, 
    certifications, 
    loading, 
    getLearningStats,
    enrollInCourse,
    createCourse
  } = useLearningDevelopment();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getLearningStats();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Available Courses</span>
              </CardTitle>
              <CardDescription>Total courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCourses}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>{stats.enrolledCourses} enrolled</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Completed</span>
              </CardTitle>
              <CardDescription>Finished courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedCourses}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{stats.totalHours}h total</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>In Progress</span>
              </CardTitle>
              <CardDescription>Active learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.inProgressCourses}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>Currently learning</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Certifications</span>
              </CardTitle>
              <CardDescription>Active credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeCertifications}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Professional credentials</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList>
            <TabsTrigger value="courses">Available Courses</TabsTrigger>
            <TabsTrigger value="enrolled">My Enrollments</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Course Catalog</span>
                  <Button onClick={() => createCourse({
                    title: 'Sample Course',
                    description: 'A sample course for demonstration',
                    category: 'Technology',
                    duration_hours: 10,
                    difficulty_level: 'beginner',
                    instructor_name: 'John Doe',
                    instructor_email: 'john@example.com',
                    status: 'active'
                  })}>
                    Create Sample Course
                  </Button>
                </CardTitle>
                <CardDescription>Browse and enroll in available courses</CardDescription>
              </CardHeader>
              <CardContent>
                {courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <Card key={course.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCourse(course)}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{course.title}</h3>
                              <p className="text-sm text-gray-600">{course.description}</p>
                              {course.category && (
                                <Badge variant="outline" className="mt-2">
                                  {course.category}
                                </Badge>
                              )}
                            </div>
                            <Button size="sm" onClick={(e) => {
                              e.stopPropagation();
                              enrollInCourse(course.id);
                            }}>
                              Enroll
                            </Button>
                          </div>
                          {course.duration_hours && (
                            <p className="text-sm text-gray-500 mt-2">
                              Duration: {course.duration_hours} hours
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
                    <p className="text-gray-600 mb-6">
                      Courses will appear here once they are added to the catalog.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enrolled">
            <Card>
              <CardHeader>
                <CardTitle>My Enrollments</CardTitle>
                <CardDescription>Track your learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedEnrollment(enrollment)}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold">{enrollment.courses?.title}</h3>
                              <p className="text-sm text-gray-600">{enrollment.courses?.description}</p>
                            </div>
                            <Badge variant={enrollment.status === 'completed' ? 'default' : 'outline'}>
                              {enrollment.status?.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{enrollment.progress || 0}%</span>
                            </div>
                            <Progress value={enrollment.progress || 0} />
                          </div>
                          {enrollment.completed_at && (
                            <p className="text-sm text-gray-500 mt-2">
                              Completed on {format(new Date(enrollment.completed_at), 'MMM dd, yyyy')}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments yet</h3>
                    <p className="text-gray-600 mb-6">
                      Enroll in courses to start your learning journey.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <CardTitle>My Certifications</CardTitle>
                <CardDescription>Professional achievements and credentials</CardDescription>
              </CardHeader>
              <CardContent>
                {certifications.length > 0 ? (
                  <div className="space-y-4">
                    {certifications.map((cert) => (
                      <Card key={cert.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{cert.name}</h3>
                              {cert.issuer && (
                                <p className="text-sm text-gray-600">Issued by {cert.issuer}</p>
                              )}
                              <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                                {cert.issue_date && (
                                  <span>Issued: {format(new Date(cert.issue_date), 'MMM yyyy')}</span>
                                )}
                                {cert.expiry_date && (
                                  <span>Expires: {format(new Date(cert.expiry_date), 'MMM yyyy')}</span>
                                )}
                              </div>
                            </div>
                            <Badge variant={cert.status === 'active' ? 'default' : 'outline'}>
                              {cert.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications yet</h3>
                    <p className="text-gray-600 mb-6">
                      Add your professional certifications to showcase your achievements.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <DetailsPanel
          title={selectedCourse ? "Course Details" : selectedEnrollment ? "Enrollment Details" : "Learning Details"}
          isEmpty={!selectedCourse && !selectedEnrollment}
          emptyMessage="Select a course or enrollment to view detailed information"
        >
          {selectedCourse && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedCourse.title}</h3>
              <p className="text-gray-600">{selectedCourse.description}</p>
              
              <div className="space-y-3">
                {selectedCourse.category && (
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{selectedCourse.category}</p>
                  </div>
                )}
                {selectedCourse.duration_hours && (
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{selectedCourse.duration_hours} hours</p>
                  </div>
                )}
                {selectedCourse.difficulty_level && (
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <Badge variant="outline">{selectedCourse.difficulty_level}</Badge>
                  </div>
                )}
                {selectedCourse.instructor_name && (
                  <div>
                    <p className="text-sm text-gray-500">Instructor</p>
                    <p className="font-medium">{selectedCourse.instructor_name}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <Button className="w-full" onClick={() => enrollInCourse(selectedCourse.id)}>
                  Enroll in Course
                </Button>
              </div>
            </div>
          )}
          
          {selectedEnrollment && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedEnrollment.courses?.title}</h3>
              <p className="text-gray-600">{selectedEnrollment.courses?.description}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={selectedEnrollment.status === 'completed' ? 'default' : 'outline'}>
                    {selectedEnrollment.status?.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <Progress value={selectedEnrollment.progress || 0} className="mt-1" />
                  <p className="text-sm font-medium mt-1">{selectedEnrollment.progress || 0}% complete</p>
                </div>
                {selectedEnrollment.enrolled_at && (
                  <div>
                    <p className="text-sm text-gray-500">Enrolled Date</p>
                    <p className="font-medium">{format(new Date(selectedEnrollment.enrolled_at), 'MMM dd, yyyy')}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </div>
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default LearningDevelopment;
