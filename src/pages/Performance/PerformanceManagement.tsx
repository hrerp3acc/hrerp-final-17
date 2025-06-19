
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
import { Target, TrendingUp, Calendar, Star, Users, Award, Clock, CheckCircle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import DetailsPanel from '@/components/Common/DetailsPanel';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { GoalDialog } from '@/components/Performance/GoalDialog';
import { GoalCard } from '@/components/Performance/GoalCard';
import type { Tables } from '@/integrations/supabase/types';

type PerformanceGoal = Tables<'performance_goals'>;
type PerformanceReview = Tables<'performance_reviews'>;

const PerformanceManagement = () => {
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoal | null>(null);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const { goals, reviews, loading, getPerformanceStats } = usePerformanceManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  const stats = getPerformanceStats();

  const performanceData = [
    { month: 'Jan', progress: 65 },
    { month: 'Feb', progress: 72 },
    { month: 'Mar', progress: 78 },
    { month: 'Apr', progress: stats.avgProgress },
  ];

  const goalStatusData = [
    { name: 'Completed', value: stats.completedGoals, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgressGoals, color: '#3b82f6' },
    { name: 'Not Started', value: stats.totalGoals - stats.completedGoals - stats.inProgressGoals - stats.overdueGoals, color: '#6b7280' },
    { name: 'Overdue', value: stats.overdueGoals, color: '#ef4444' }
  ];

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
              <div className="text-3xl font-bold">{stats.totalGoals}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>{stats.completedGoals} completed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Avg Progress</span>
              </CardTitle>
              <CardDescription>Overall completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avgProgress}%</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Keep progressing!</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Reviews Due</span>
              </CardTitle>
              <CardDescription>Pending reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingReviews}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-red-500" />
                <span>{stats.completedReviews} completed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Avg Rating</span>
              </CardTitle>
              <CardDescription>Performance score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avgRating || 'N/A'}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Out of 5.0</span>
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
                  <GoalDialog>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Goal
                    </Button>
                  </GoalDialog>
                </CardTitle>
                <CardDescription>Track your objectives and key results</CardDescription>
              </CardHeader>
              <CardContent>
                {goals.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {goals.map((goal) => (
                      <GoalCard 
                        key={goal.id} 
                        goal={goal} 
                        onSelect={setSelectedGoal}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start by creating your first goal to track your progress and achievements.
                    </p>
                    <GoalDialog>
                      <Button>Create Your First Goal</Button>
                    </GoalDialog>
                  </div>
                )}
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
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedReview(review)}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {format(new Date(review.review_period_start), 'MMM yyyy')} - {format(new Date(review.review_period_end), 'MMM yyyy')}
                              </h3>
                              <p className="text-sm text-gray-600">Review Period</p>
                            </div>
                            <Badge variant={review.status === 'completed' ? 'default' : 'outline'}>
                              {review.status}
                            </Badge>
                          </div>
                          {review.overall_rating && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-600">Overall Rating</p>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star}
                                      className={`w-4 h-4 ${star <= review.overall_rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">{review.overall_rating}/5</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews scheduled</h3>
                    <p className="text-gray-600 mb-6">
                      Performance reviews will appear here once they are scheduled.
                    </p>
                    <Button>Schedule Review</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Progress tracking over time</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.totalGoals > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Progress Over Time</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-4">Goal Status Distribution</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={goalStatusData.filter(item => item.value > 0)}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {goalStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No performance data</h3>
                    <p className="text-gray-600 mb-6">
                      Analytics will be available once you start tracking goals and performance.
                    </p>
                  </div>
                )}
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
              {selectedGoal.description && (
                <p className="text-gray-600">{selectedGoal.description}</p>
              )}
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <Progress value={selectedGoal.progress || 0} className="mt-1" />
                  <p className="text-sm font-medium mt-1">{selectedGoal.progress || 0}% complete</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={selectedGoal.status === "completed" ? "default" : selectedGoal.status === "in_progress" ? "secondary" : "outline"}>
                    {selectedGoal.status?.replace('_', ' ') || 'Not Started'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{format(new Date(selectedGoal.target_date), 'MMM dd, yyyy')}</p>
                </div>
                {selectedGoal.category && (
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{selectedGoal.category}</p>
                  </div>
                )}
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
              <h3 className="text-lg font-semibold">Performance Review</h3>
              <p className="text-gray-600">
                {format(new Date(selectedReview.review_period_start), 'MMM yyyy')} - {format(new Date(selectedReview.review_period_end), 'MMM yyyy')}
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={selectedReview.status === "completed" ? "secondary" : selectedReview.status === "draft" ? "outline" : "default"}>
                    {selectedReview.status}
                  </Badge>
                </div>
                {selectedReview.overall_rating && (
                  <div>
                    <p className="text-sm text-gray-500">Overall Score</p>
                    <p className="font-medium">{selectedReview.overall_rating}/5.0</p>
                  </div>
                )}
                {selectedReview.achievements && (
                  <div>
                    <p className="text-sm text-gray-500">Key Achievements</p>
                    <p className="text-sm">{selectedReview.achievements}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full">
                  {selectedReview.status === "completed" ? "View Report" : "Continue Review"}
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
