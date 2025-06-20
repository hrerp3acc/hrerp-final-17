
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type PerformanceReview = Tables<'performance_reviews'>;

interface ReviewsTabProps {
  reviews: PerformanceReview[];
  onSelectReview: (review: PerformanceReview) => void;
}

export const ReviewsTab = ({ reviews, onSelectReview }: ReviewsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Reviews</CardTitle>
        <CardDescription>Conduct and track performance evaluations</CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectReview(review)}>
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
  );
};
