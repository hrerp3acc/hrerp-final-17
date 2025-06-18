
import { useState } from 'react';
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
import DetailsPanel from '@/components/Common/DetailsPanel';

const PerformanceManagement = () => {
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const performanceData: any[] = [];
  const goalStatusData: any[] = [];

  const attendanceStats = {
    activeGoals: goals.length,
    avgPerformance: 0,
    reviewsDue: reviews.filter(review => review.status === 'pending').length,
    goalsCompleted: goals.filter(goal => goal.status === 'completed').length
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span>Active Goals</span>
              </CardTitle>
              <CardDescription>Current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{attendanceStats.activeGoals}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Ready to set goals</span>
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
              <div className="text-3xl font-bold">{attendanceStats.avgPerformance}%</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Award className="w-4 h-4 text-gold-500" />
                <span>No data yet</span>
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
              <div className="text-3xl font-bold">{attendanceStats.reviewsDue}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-red-500" />
                <span>No pending reviews</span>
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
              <div className="text-3xl font-bold">{attendanceStats.goalsCompleted}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Start achieving goals</span>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Goals</span>
                  <Button>Add New Goal</Button>
                </CardTitle>
                <CardDescription>Track your objectives and key results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start by creating your first goal to track your progress and achievements.
                  </p>
                  <Button>Create Your First Goal</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Performance Reviews</CardTitle>
                <CardDescription>Conduct and track performance evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews scheduled</h3>
                  <p className="text-gray-600 mb-6">
                    Performance reviews will appear here once they are scheduled.
                  </p>
                  <Button>Schedule Review</Button>
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
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No performance data</h3>
                  <p className="text-gray-600 mb-6">
                    Analytics will be available once you start tracking goals and performance.
                  </p>
                </div>
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
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No development plans</h3>
                  <p className="text-gray-600 mb-6">
                    Create development plans to enhance your skills and advance your career.
                  </p>
                  <Button>Create Development Plan</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <DetailsPanel
          title="Performance Details"
          isEmpty={!selectedGoal && !selectedReview}
          emptyMessage="Select a goal or review to view detailed information"
        >
          {selectedGoal && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedGoal.title}</h3>
              <p className="text-gray-600">{selectedGoal.description}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <Progress value={selectedGoal.progress} className="mt-1" />
                  <p className="text-sm font-medium mt-1">{selectedGoal.progress}% complete</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={selectedGoal.status === "On Track" ? "default" : selectedGoal.status === "Ahead" ? "secondary" : "outline"}>
                    {selectedGoal.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{selectedGoal.due}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full">Update Progress</Button>
                <Button className="w-full" variant="outline">Edit Goal</Button>
                <Button className="w-full" variant="outline">View History</Button>
              </div>
            </div>
          )}
          
          {selectedReview && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedReview.employee}</h3>
              <p className="text-gray-600">{selectedReview.type}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={selectedReview.status === "Completed" ? "secondary" : selectedReview.status === "Pending" ? "outline" : "default"}>
                    {selectedReview.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{selectedReview.due}</p>
                </div>
                {selectedReview.score && (
                  <div>
                    <p className="text-sm text-gray-500">Overall Score</p>
                    <p className="font-medium">{selectedReview.score}/5.0</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full">
                  {selectedReview.status === "Completed" ? "View Report" : "Continue Review"}
                </Button>
                <Button className="w-full" variant="outline">Schedule Meeting</Button>
                <Button className="w-full" variant="outline">Send Reminder</Button>
              </div>
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default PerformanceManagement;
