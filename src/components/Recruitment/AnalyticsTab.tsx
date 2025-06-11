
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface AnalyticsTabProps {
  recruitmentData: any[];
}

const AnalyticsTab = ({ recruitmentData }: AnalyticsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recruitment Analytics</CardTitle>
        <CardDescription>Track hiring metrics and performance</CardDescription>
      </CardHeader>
      <CardContent>
        {recruitmentData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No analytics data available</p>
              <p className="text-sm">Start recruiting to see analytics and trends</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={recruitmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#3b82f6" name="Applications" />
              <Line type="monotone" dataKey="interviews" stroke="#10b981" name="Interviews" />
              <Line type="monotone" dataKey="hired" stroke="#f59e0b" name="Hired" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
