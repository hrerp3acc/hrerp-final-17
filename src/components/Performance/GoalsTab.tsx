
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus } from 'lucide-react';
import { GoalDialog } from '@/components/Performance/GoalDialog';
import { GoalCard } from '@/components/Performance/GoalCard';
import type { Tables } from '@/integrations/supabase/types';

type PerformanceGoal = Tables<'performance_goals'>;

interface GoalsTabProps {
  goals: PerformanceGoal[];
  onSelectGoal: (goal: PerformanceGoal) => void;
}

export const GoalsTab = ({ goals, onSelectGoal }: GoalsTabProps) => {
  return (
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
                onSelect={onSelectGoal}
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
  );
};
