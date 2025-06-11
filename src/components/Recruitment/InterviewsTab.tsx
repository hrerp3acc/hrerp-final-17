
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';

const InterviewsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Schedule</CardTitle>
        <CardDescription>Manage upcoming and past interviews</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews scheduled</h3>
          <p className="text-gray-600 mb-6">
            Interviews will appear here once you start scheduling them with candidates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewsTab;
