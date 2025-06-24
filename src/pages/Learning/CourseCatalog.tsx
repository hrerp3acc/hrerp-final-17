
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Filter, Clock, Users, GraduationCap } from 'lucide-react';
import { useLearningDevelopment } from '@/hooks/useLearningDevelopment';

const CourseCatalog = () => {
  const { courses, loading, enrollInCourse } = useLearningDevelopment();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
          <p className="text-gray-600">Browse and enroll in available courses</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-bold">{new Set(courses.map(c => c.category).filter(Boolean)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold">{courses.reduce((sum, c) => sum + (c.duration_hours || 0), 0)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{course.description}</CardDescription>
                  </div>
                  {course.difficulty_level && (
                    <Badge variant={
                      course.difficulty_level === 'beginner' ? 'default' :
                      course.difficulty_level === 'intermediate' ? 'secondary' : 'destructive'
                    }>
                      {course.difficulty_level}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {course.category && (
                      <Badge variant="outline">{course.category}</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    {course.duration_hours && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration_hours}h</span>
                      </div>
                    )}
                    {course.instructor_name && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span className="truncate">{course.instructor_name}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => enrollInCourse(course.id)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600 mb-6">
              Course catalog is empty. New courses will appear here once they are added to the system.
            </p>
            <p className="text-sm text-gray-500">
              Contact your administrator to add courses to the catalog.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseCatalog;
