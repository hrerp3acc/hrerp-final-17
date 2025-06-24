
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { useMemo } from 'react';

interface AnalyticsTabProps {
  stats: {
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    overdueGoals: number;
    avgProgress: number;
  };
}

export const AnalyticsTab = ({ stats }: AnalyticsTabProps) => {
  const { goals, reviews } = usePerformanceManagement();

  const performanceData = useMemo(() => {
    // Generate monthly progress data from actual goals
    const monthlyData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate average progress for goals created before this month
      const goalsBeforeMonth = goals.filter(goal => 
        new Date(goal.created_at) <= date
      );
      
      const avgProgress = goalsBeforeMonth.length > 0 
        ? goalsBeforeMonth.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goalsBeforeMonth.length
        : 0;
      
      monthlyData.push({
        month: monthName,
        progress: Math.round(avgProgress)
      });
    }
    
    return monthlyData;
  }, [goals]);

  const goalStatusData = useMemo(() => [
    { name: 'Completed', value: stats.completedGoals, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgressGoals, color: '#3b82f6' },
    { name: 'Not Started', value: stats.totalGoals - stats.completedGoals - stats.inProgressGoals - stats.overdueGoals, color: '#6b7280' },
    { name: 'Overdue', value: stats.overdueGoals, color: '#ef4444' }
  ].filter(item => item.value > 0), [stats]);

  const categoryData = useMemo(() => {
    const categoryMap = new Map();
    goals.forEach(goal => {
      const category = goal.category || 'General';
      const current = categoryMap.get(category) || { category, count: 0, avgProgress: 0 };
      current.count += 1;
      current.avgProgress = ((current.avgProgress * (current.count - 1)) + (goal.progress || 0)) / current.count;
      categoryMap.set(category, current);
    });
    
    return Array.from(categoryMap.values()).map(item => ({
      ...item,
      avgProgress: Math.round(item.avgProgress)
    }));
  }, [goals]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>Comprehensive performance insights and trends</CardDescription>
      </CardHeader>
      <CardContent>
        {stats.totalGoals > 0 ? (
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-medium mb-4">Progress Over Time</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Average Progress']} />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Goal Status Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={goalStatusData}
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

              {categoryData.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-4">Performance by Category</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Avg Progress']} />
                      <Bar dataKey="avgProgress" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {reviews.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4">Review Ratings Trend</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reviews.slice(-6).map((review, index) => ({
                    period: `Review ${index + 1}`,
                    rating: review.overall_rating || 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value) => [`${value}/5`, 'Rating']} />
                    <Line 
                      type="monotone" 
                      dataKey="rating" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
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
  );
};
