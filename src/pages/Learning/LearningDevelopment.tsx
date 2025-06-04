
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, Award, Clock, TrendingUp, Users, 
  Search, Star, PlayCircle, CheckCircle, Calendar
} from 'lucide-react';

const LearningDevelopment = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Available Courses</span>
            </CardTitle>
            <CardDescription>In catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>+12 new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PlayCircle className="w-4 h-4 text-green-500" />
              <span>In Progress</span>
            </CardTitle>
            <CardDescription>Active learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>24 hours remaining</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Completed</span>
            </CardTitle>
            <CardDescription>This year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Award className="w-4 h-4 text-purple-500" />
              <span>6 certifications</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>Team Progress</span>
            </CardTitle>
            <CardDescription>Average completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Above company avg</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList>
          <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
          <TabsTrigger value="my-learning">My Learning</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="learning-paths">Learning Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog">
          <Card>
            <CardHeader>
              <CardTitle>Course Catalog</CardTitle>
              <CardDescription>Browse and enroll in available courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search courses..." className="pl-10" />
                </div>
                <Button variant="outline">Filter by Category</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    title: "Leadership Fundamentals", 
                    category: "Leadership", 
                    duration: "6 hours", 
                    rating: 4.8, 
                    enrolled: 124,
                    level: "Beginner"
                  },
                  { 
                    title: "Data Analysis with Python", 
                    category: "Technical", 
                    duration: "12 hours", 
                    rating: 4.9, 
                    enrolled: 89,
                    level: "Intermediate"
                  },
                  { 
                    title: "Effective Communication", 
                    category: "Soft Skills", 
                    duration: "4 hours", 
                    rating: 4.7, 
                    enrolled: 156,
                    level: "Beginner"
                  },
                  { 
                    title: "Project Management", 
                    category: "Management", 
                    duration: "8 hours", 
                    rating: 4.6, 
                    enrolled: 97,
                    level: "Intermediate"
                  },
                  { 
                    title: "Digital Marketing", 
                    category: "Marketing", 
                    duration: "10 hours", 
                    rating: 4.5, 
                    enrolled: 78,
                    level: "Advanced"
                  },
                  { 
                    title: "Financial Planning", 
                    category: "Finance", 
                    duration: "6 hours", 
                    rating: 4.8, 
                    enrolled: 65,
                    level: "Intermediate"
                  }
                ].map((course, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge variant="secondary">{course.level}</Badge>
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.duration}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {course.rating}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.enrolled} enrolled
                        </div>
                        <Button className="w-full">Enroll Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-learning">
          <Card>
            <CardHeader>
              <CardTitle>My Learning Journey</CardTitle>
              <CardDescription>Track your progress and continue learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Leadership Fundamentals", progress: 75, status: "In Progress", nextLesson: "Module 4: Team Building" },
                  { title: "Data Analysis with Python", progress: 45, status: "In Progress", nextLesson: "Module 3: Data Visualization" },
                  { title: "Effective Communication", progress: 100, status: "Completed", completedDate: "Oct 15, 2024" },
                  { title: "Project Management", progress: 30, status: "In Progress", nextLesson: "Module 2: Planning Phase" },
                ].map((course, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{course.title}</h4>
                      <Badge variant={course.status === "Completed" ? "secondary" : "default"}>
                        {course.status}
                      </Badge>
                    </div>
                    <Progress value={course.progress} className="mb-2" />
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{course.progress}% complete</span>
                      {course.status === "Completed" ? (
                        <span>Completed: {course.completedDate}</span>
                      ) : (
                        <span>Next: {course.nextLesson}</span>
                      )}
                    </div>
                    {course.status !== "Completed" && (
                      <Button variant="outline" size="sm" className="mt-2">
                        Continue Learning
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Achievements</CardTitle>
              <CardDescription>Your earned certificates and badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Project Management Professional", issuer: "PMI", date: "Oct 2024", valid: "Oct 2027" },
                  { name: "Leadership Excellence", issuer: "Internal", date: "Sep 2024", valid: "N/A" },
                  { name: "Data Analysis Certification", issuer: "Data Institute", date: "Aug 2024", valid: "Aug 2026" },
                  { name: "Communication Skills", issuer: "Internal", date: "Jul 2024", valid: "N/A" },
                  { name: "Agile Methodology", issuer: "Scrum Alliance", date: "Jun 2024", valid: "Jun 2026" },
                  { name: "Digital Marketing", issuer: "Google", date: "May 2024", valid: "May 2025" },
                ].map((cert, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <Award className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
                      <CardTitle className="text-lg">{cert.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm text-gray-500">
                        <div>Issued by: {cert.issuer}</div>
                        <div>Earned: {cert.date}</div>
                        <div>Valid until: {cert.valid}</div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Certificate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning-paths">
          <Card>
            <CardHeader>
              <CardTitle>Learning Paths</CardTitle>
              <CardDescription>Structured learning journeys for career development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: "Leadership Development Track", 
                    courses: 8, 
                    duration: "3 months", 
                    progress: 60,
                    description: "Comprehensive leadership skills development"
                  },
                  { 
                    title: "Technical Skills Enhancement", 
                    courses: 12, 
                    duration: "6 months", 
                    progress: 25,
                    description: "Advanced technical competencies"
                  },
                  { 
                    title: "Sales Professional Certification", 
                    courses: 6, 
                    duration: "2 months", 
                    progress: 0,
                    description: "Complete sales methodology training"
                  },
                ].map((path, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{path.title}</h4>
                      <Badge variant="outline">{path.courses} courses</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                    <Progress value={path.progress} className="mb-2" />
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{path.progress}% complete • {path.duration}</span>
                      <Button variant="outline" size="sm">
                        {path.progress === 0 ? "Start Path" : "Continue"}
                      </Button>
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

export default LearningDevelopment;
