
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';

interface RecruitmentStatsProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    hiredApplications: number;
    avgApplicationsPerJob: number;
    hireRate: number;
  };
}

const RecruitmentStats = ({ stats }: RecruitmentStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span>Active Jobs</span>
          </CardTitle>
          <CardDescription>Currently open</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.activeJobs}</div>
          <div className="text-sm text-gray-500">
            of {stats.totalJobs} total jobs
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-green-500" />
            <span>Applications</span>
          </CardTitle>
          <CardDescription>Total received</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalApplications}</div>
          <div className="text-sm text-gray-500">
            {stats.avgApplicationsPerJob} avg per job
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Hired</span>
          </CardTitle>
          <CardDescription>Successful hires</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.hiredApplications}</div>
          <div className="text-sm text-gray-500">
            {stats.hireRate}% hire rate
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span>Success Rate</span>
          </CardTitle>
          <CardDescription>Hiring efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.hireRate}%</div>
          <div className="text-sm text-gray-500">
            from applications
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentStats;
