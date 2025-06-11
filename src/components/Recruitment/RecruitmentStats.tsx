
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserPlus, Briefcase, Calendar, Clock, FileText, 
  Users, TrendingUp, CheckCircle 
} from 'lucide-react';

const RecruitmentStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span>Open Positions</span>
          </CardTitle>
          <CardDescription>Currently hiring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>No positions yet</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-green-500" />
            <span>Applications</span>
          </CardTitle>
          <CardDescription>This month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>No applications yet</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Interviews</span>
          </CardTitle>
          <CardDescription>Scheduled</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <Clock className="w-4 h-4 text-red-500" />
            <span>No interviews scheduled</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Hires</span>
          </CardTitle>
          <CardDescription>This quarter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <Users className="w-4 h-4 text-purple-500" />
            <span>No hires yet</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentStats;
