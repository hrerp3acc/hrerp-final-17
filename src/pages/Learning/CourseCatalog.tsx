
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Filter, Clock, Users } from 'lucide-react';
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

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {course.category && (
                      <Badge variant="outline">{course.category}</Badge>
                    )}
                    {course.difficulty_level && (
                      <Badge variant="secondary">{course.difficulty_level}</Badge>
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
                        <span>{course.instructor_name}</span>
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
              Course catalog is empty. Courses will appear here once they are added to the system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseCatalog;
