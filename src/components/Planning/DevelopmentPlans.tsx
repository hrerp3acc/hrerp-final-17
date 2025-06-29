
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DevelopmentPlan } from '@/types/successionPlanning';

interface DevelopmentPlansProps {
  developmentPlans: DevelopmentPlan[];
}

const DevelopmentPlans = ({ developmentPlans }: DevelopmentPlansProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Plans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {developmentPlans.map((plan) => (
            <div key={plan.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">
                    {plan.candidate?.employee ? 
                      `${plan.candidate.employee.first_name} ${plan.candidate.employee.last_name}` : 
                      'Unknown Candidate'
                    }
                  </h4>
                  <p className="text-sm text-gray-600">Target: {plan.target_position}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="font-semibold">{plan.progress}%</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Development Activities</div>
                <div className="space-y-1">
                  {plan.activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-600">Timeline: </span>
                  <span className="font-medium">{plan.timeline || 'Not set'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Next Review: </span>
                  <span className="font-medium">{plan.next_review_date || 'Not scheduled'}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DevelopmentPlans;
