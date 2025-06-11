
import { useState } from 'react';
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
  Search, Filter, Users, TrendingUp, CheckCircle, Plus 
} from 'lucide-react';
import DetailsPanel from '@/components/Common/DetailsPanel';

const RecruitmentManagement = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Empty data arrays - will be populated when user adds data
  const jobs: any[] = [];
  const candidates: any[] = [];
  const recruitmentData: any[] = [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
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
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
                    <p className="text-gray-600 mb-6">
                      Create your first job posting to start recruiting candidates.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div 
                        key={job.id} 
                        className="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedJob(job)}
                      >
                        {/* Job content */}
                      </div>
                    ))}
                  </div>
                )}
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
                {candidates.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
                    <p className="text-gray-600 mb-6">
                      Candidates will appear here once you start receiving applications.
                    </p>
                  </div>
                ) : (
                  <div>
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
                      {candidates.map((candidate) => (
                        <div 
                          key={candidate.id} 
                          className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          {/* Candidate content */}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews scheduled</h3>
                  <p className="text-gray-600 mb-6">
                    Interviews will appear here once you start scheduling them with candidates.
                  </p>
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
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <DetailsPanel
          title={selectedJob ? "Job Details" : selectedCandidate ? "Candidate Details" : "Recruitment Details"}
          isEmpty={!selectedJob && !selectedCandidate}
          emptyMessage="Select a job posting or candidate to view detailed information"
        >
          {selectedJob && (
            <div className="space-y-4">
              {/* Job details content */}
            </div>
          )}
          
          {selectedCandidate && (
            <div className="space-y-4">
              {/* Candidate details content */}
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default RecruitmentManagement;
