
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useRecruitment } from '@/hooks/useRecruitment';
import { useMemo } from 'react';

interface AnalyticsTabProps {
  recruitmentData?: any[];
}

const AnalyticsTab = ({ recruitmentData = [] }: AnalyticsTabProps) => {
  const { jobPostings, jobApplications } = useRecruitment();

  const monthlyData = useMemo(() => {
    const currentDate = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Filter applications by month
      const monthApplications = jobApplications.filter(app => {
        const appDate = new Date(app.applied_at);
        return appDate >= date && appDate <= nextMonth;
      });
      
      const applications = monthApplications.length;
      const interviews = monthApplications.filter(app => app.status === 'interview').length;
      const hired = monthApplications.filter(app => app.status === 'hired').length;
      
      months.push({
        month: monthName,
        applications,
        interviews,
        hired
      });
    }
    
    return months;
  }, [jobApplications]);

  const statusData = useMemo(() => {
    const statusCounts = jobApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = {
      applied: '#3b82f6',
      interview: '#f59e0b',
      hired: '#10b981',
      rejected: '#ef4444'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: colors[status as keyof typeof colors] || '#6b7280'
    }));
  }, [jobApplications]);

  const jobPostingStats = useMemo(() => {
    return jobPostings.map(job => ({
      title: job.title.substring(0, 20) + (job.title.length > 20 ? '...' : ''),
      applications: jobApplications.filter(app => app.job_posting_id === job.id).length,
      hired: jobApplications.filter(app => app.job_posting_id === job.id && app.status === 'hired').length
    }));
  }, [jobPostings, jobApplications]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recruitment Analytics</CardTitle>
        <CardDescription>Track hiring metrics and performance</CardDescription>
      </CardHeader>
      <CardContent>
        {jobApplications.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No analytics data available</p>
              <p className="text-sm">Start recruiting to see analytics and trends</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-medium mb-4">Monthly Recruitment Trends</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" name="Applications" strokeWidth={2} />
                  <Line type="monotone" dataKey="interviews" stroke="#10b981" name="Interviews" strokeWidth={2} />
                  <Line type="monotone" dataKey="hired" stroke="#f59e0b" name="Hired" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Application Status Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {jobPostingStats.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-4">Applications per Job Posting</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={jobPostingStats.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                      <Bar dataKey="hired" fill="#10b981" name="Hired" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
