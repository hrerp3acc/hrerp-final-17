
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Target, TrendingUp, Calendar, Star, Users, Award, Clock, CheckCircle } from 'lucide-react';

const performanceData = [
  { name: 'Q1', performance: 85, goals: 90 },
  { name: 'Q2', performance: 88, goals: 85 },
  { name: 'Q3', performance: 92, goals: 95 },
  { name: 'Q4', performance: 89, goals: 88 },
];

const goalStatusData = [
  { name: 'Completed', value: 45, color: '#22c55e' },
  { name: 'In Progress', value: 30, color: '#3b82f6' },
  { name: 'Overdue', value: 15, color: '#ef4444' },
  { name: 'Not Started', value: 10, color: '#6b7280' },
];

const PerformanceManagement = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span>Active Goals</span>
            </CardTitle>
            <CardDescription>Current period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>+3 from last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Avg Performance</span>
            </CardTitle>
            <CardDescription>Team average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">88.5%</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Award className="w-4 h-4 text-gold-500" />
              <span>Above target</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Reviews Due</span>
            </CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>5 overdue</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Goals Completed</span>
            </CardTitle>
            <CardDescription>This quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>75% completion rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList>
          <TabsTrigger value="goals">Goal Management</TabsTrigger>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="development">Development Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>My Goals</span>
                    <Button>Add New Goal</Button>
                  </CardTitle>
                  <CardDescription>Track your objectives and key results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Increase Sales Revenue", progress: 85, status: "On Track", due: "Dec 31, 2024" },
                      { title: "Complete Leadership Training", progress: 60, status: "In Progress", due: "Nov 15, 2024" },
                      { title: "Improve Customer Satisfaction", progress: 95, status: "Ahead", due: "Oct 30, 2024" },
                    ].map((goal, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{goal.title}</h4>
                          <Badge variant={goal.status === "On Track" ? "default" : goal.status === "Ahead" ? "secondary" : "outline"}>
                            {goal.status}
                          </Badge>
                        </div>
                        <Progress value={goal.progress} className="mb-2" />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{goal.progress}% complete</span>
                          <span>Due: {goal.due}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Goal Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={goalStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {goalStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>Conduct and track performance evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { employee: "Sarah Johnson", type: "Annual Review", status: "Pending", due: "Nov 30, 2024" },
                  { employee: "Mike Chen", type: "Mid-year Review", status: "Completed", due: "Oct 15, 2024" },
                  { employee: "Emily Davis", type: "Probation Review", status: "In Progress", due: "Dec 5, 2024" },
                ].map((review, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{review.employee}</h4>
                      <p className="text-sm text-gray-500">{review.type}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={review.status === "Completed" ? "secondary" : review.status === "Pending" ? "outline" : "default"}>
                        {review.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">Due: {review.due}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {review.status === "Completed" ? "View" : "Continue"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Quarterly performance vs goals comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="performance" fill="#3b82f6" name="Performance Score" />
                  <Bar dataKey="goals" fill="#10b981" name="Goal Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development">
          <Card>
            <CardHeader>
              <CardTitle>Development Plans</CardTitle>
              <CardDescription>Career development and skill enhancement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { skill: "Leadership", current: 70, target: 85, training: "Leadership Bootcamp" },
                  { skill: "Data Analysis", current: 60, target: 80, training: "Advanced Analytics Course" },
                  { skill: "Communication", current: 85, target: 90, training: "Public Speaking Workshop" },
                ].map((plan, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{plan.skill}</h4>
                      <span className="text-sm text-gray-500">{plan.current}% → {plan.target}%</span>
                    </div>
                    <Progress value={plan.current} className="mb-2" />
                    <p className="text-sm text-gray-600">Recommended: {plan.training}</p>
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

export default PerformanceManagement;
