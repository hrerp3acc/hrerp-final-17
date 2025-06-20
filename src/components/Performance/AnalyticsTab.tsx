
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp } from 'lucide-react';

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
  );
};
