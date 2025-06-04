
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  UserPlus, Briefcase, Calendar, Clock, FileText, 
  Search, Filter, Users, TrendingUp, CheckCircle 
} from 'lucide-react';

const recruitmentData = [
  { month: 'Jan', applications: 120, hired: 8, interviews: 45 },
  { month: 'Feb', applications: 95, hired: 6, interviews: 38 },
  { month: 'Mar', applications: 150, hired: 12, interviews: 52 },
  { month: 'Apr', applications: 180, hired: 15, interviews: 68 },
  { month: 'May', applications: 200, hired: 18, interviews: 75 },
  { month: 'Jun', applications: 165, hired: 14, interviews: 58 },
];

const RecruitmentManagement = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span>Open Positions</span>
            </CardTitle>
            <CardDescription>Currently hiring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>+3 new this week</span>
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
            <div className="text-3xl font-bold">165</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>42 pending review</span>
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
            <div className="text-3xl font-bold">28</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Clock className="w-4 h-4 text-red-500" />
              <span>5 today</span>
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
            <div className="text-3xl font-bold">42</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Users className="w-4 h-4 text-purple-500" />
              <span>12% hire rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Job Postings</span>
                <Button>Post New Job</Button>
              </CardTitle>
              <CardDescription>Manage open positions and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Senior Software Engineer", department: "Engineering", applications: 45, status: "Active", posted: "2024-10-15" },
                  { title: "Marketing Manager", department: "Marketing", applications: 32, status: "Active", posted: "2024-10-20" },
                  { title: "HR Business Partner", department: "Human Resources", applications: 28, status: "Active", posted: "2024-10-18" },
                  { title: "Data Analyst", department: "Analytics", applications: 38, status: "Paused", posted: "2024-10-12" },
                ].map((job, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-500">{job.department} • Posted {job.posted}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="font-medium">{job.applications}</div>
                        <div className="text-xs text-gray-500">Applications</div>
                      </div>
                      <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Pipeline</CardTitle>
              <CardDescription>Track candidates through the hiring process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search candidates..." className="pl-10" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Alice Cooper", position: "Senior Software Engineer", stage: "Final Interview", score: 92, experience: "8 years" },
                  { name: "Bob Wilson", position: "Marketing Manager", stage: "Technical Review", score: 85, experience: "6 years" },
                  { name: "Carol Zhang", position: "Data Analyst", stage: "HR Screen", score: 78, experience: "4 years" },
                  { name: "David Kim", position: "HR Business Partner", stage: "Reference Check", score: 88, experience: "10 years" },
                ].map((candidate, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{candidate.name}</h4>
                        <p className="text-sm text-gray-500">{candidate.position} • {candidate.experience}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-medium">{candidate.score}%</div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                        <Badge>{candidate.stage}</Badge>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <CardTitle>Interview Schedule</CardTitle>
              <CardDescription>Manage upcoming and past interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { candidate: "Alice Cooper", position: "Senior Software Engineer", time: "Today, 2:00 PM", interviewer: "John Smith", type: "Final Interview" },
                  { candidate: "Carol Zhang", position: "Data Analyst", time: "Tomorrow, 10:00 AM", interviewer: "Sarah Johnson", type: "Technical Interview" },
                  { candidate: "David Kim", position: "HR Business Partner", time: "Nov 8, 3:00 PM", interviewer: "Mike Chen", type: "Panel Interview" },
                ].map((interview, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{interview.candidate}</h4>
                      <p className="text-sm text-gray-500">{interview.position} • {interview.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{interview.time}</div>
                      <div className="text-sm text-gray-500">with {interview.interviewer}</div>
                    </div>
                    <Button variant="outline" size="sm">Join/Reschedule</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Analytics</CardTitle>
              <CardDescription>Track hiring metrics and performance</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruitmentManagement;
