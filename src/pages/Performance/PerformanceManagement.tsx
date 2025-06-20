
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import DetailsPanel from '@/components/Common/DetailsPanel';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { PerformanceStats } from '@/components/Performance/PerformanceStats';
import { GoalsTab } from '@/components/Performance/GoalsTab';
import { ReviewsTab } from '@/components/Performance/ReviewsTab';
import { AnalyticsTab } from '@/components/Performance/AnalyticsTab';
import { DevelopmentTab } from '@/components/Performance/DevelopmentTab';
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <PerformanceStats stats={stats} />

        <Tabs defaultValue="goals" className="w-full">
          <TabsList>
            <TabsTrigger value="goals">Goal Management</TabsTrigger>
            <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            <TabsTrigger value="development">Development Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="goals">
            <GoalsTab goals={goals} onSelectGoal={setSelectedGoal} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab reviews={reviews} onSelectReview={setSelectedReview} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab stats={stats} />
          </TabsContent>

          <TabsContent value="development">
            <DevelopmentTab />
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
