
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type PerformanceGoal = Tables<'performance_goals'>;

interface GoalCardProps {
  goal: PerformanceGoal;
  onSelect: (goal: PerformanceGoal) => void;
}

export const GoalCard = ({ goal, onSelect }: GoalCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      default:
        return status;
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(goal)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{goal.title}</CardTitle>
          <Badge className={getStatusColor(goal.status || 'not_started')}>
            {getStatusLabel(goal.status || 'not_started')}
          </Badge>
        </div>
        {goal.description && (
          <CardDescription className="line-clamp-2">{goal.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{goal.progress || 0}%</span>
            </div>
            <Progress value={goal.progress || 0} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Due: {format(new Date(goal.target_date), 'MMM dd, yyyy')}</span>
            </div>
            {goal.category && (
              <Badge variant="outline" className="text-xs">
                {goal.category}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>Weight: {goal.weight || 100}%</span>
            </div>
            <Button size="sm" variant="outline" onClick={(e) => {
              e.stopPropagation();
              onSelect(goal);
            }}>
              <TrendingUp className="w-4 h-4 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
