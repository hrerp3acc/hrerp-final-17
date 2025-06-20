
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Clock, CheckCircle, Calendar, Award } from 'lucide-react';

interface PerformanceStatsProps {
  stats: {
    totalGoals: number;
    completedGoals: number;
    avgProgress: number;
    pendingReviews: number;
    completedReviews: number;
    avgRating: number;
  };
}

export const PerformanceStats = ({ stats }: PerformanceStatsProps) => {
  return (
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
            <Award className="w-4 h-4 text-yellow-500" />
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
  );
};
