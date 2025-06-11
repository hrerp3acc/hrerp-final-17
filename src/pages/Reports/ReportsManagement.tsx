
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, Download, Calendar, Clock, TrendingUp, 
  BarChart3, PieChart, Users, Search, Filter 
} from 'lucide-react';
import DetailsPanel from '@/components/Common/DetailsPanel';

const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const reports = [
    { id: 1, name: "Monthly Attendance Report", type: "Attendance", status: "Ready", lastGenerated: "2024-11-05", size: "2.4 MB", description: "Comprehensive attendance analysis for October 2024" },
    { id: 2, name: "Payroll Summary Q3", type: "Payroll", status: "Processing", lastGenerated: "2024-10-31", size: "5.1 MB", description: "Quarterly payroll breakdown and analysis" },
    { id: 3, name: "Employee Performance Review", type: "Performance", status: "Ready", lastGenerated: "2024-11-03", size: "3.7 MB", description: "Performance metrics and evaluation summary" },
    { id: 4, name: "Leave Balance Analysis", type: "Leave", status: "Scheduled", lastGenerated: "2024-10-28", size: "1.8 MB", description: "Leave balance and utilization report" },
  ];

  const templates = [
    { id: 1, name: "Attendance Summary", category: "Time & Attendance", frequency: "Monthly", fields: 12 },
    { id: 2, name: "Payroll Register", category: "Compensation", frequency: "Bi-weekly", fields: 18 },
    { id: 3, name: "Performance Dashboard", category: "Performance", frequency: "Quarterly", fields: 15 },
    { id: 4, name: "Headcount Report", category: "Analytics", frequency: "Monthly", fields: 8 },
  ];

  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Total Reports</span>
              </CardTitle>
              <CardDescription>Generated this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">247</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-green-500" />
                <span>Downloads</span>
              </CardTitle>
              <CardDescription>Report downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,842</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>456 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Scheduled Reports</span>
              </CardTitle>
              <CardDescription>Automated reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">18</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>3 due today</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Active Users</span>
              </CardTitle>
              <CardDescription>Report consumers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">89</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <PieChart className="w-4 h-4 text-green-500" />
                <span>25 managers</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList>
            <TabsTrigger value="reports">Generated Reports</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="analytics">Report Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Reports</span>
                  <Button>Generate New Report</Button>
                </CardTitle>
                <CardDescription>View and download generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div 
                      key={report.id} 
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{report.name}</h4>
                        <Badge variant={
                          report.status === "Ready" ? "secondary" : 
                          report.status === "Processing" ? "default" : "outline"
                        }>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{report.type} Report</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Generated: {report.lastGenerated}</span>
                        <div className="flex items-center space-x-4">
                          <span>Size: {report.size}</span>
                          <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Predefined report formats and structures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-500">{template.category} • {template.fields} fields</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{template.frequency}</Badge>
                        <Button variant="outline" size="sm">Use Template</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automated report generation settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Weekly Attendance Summary", schedule: "Every Monday 9:00 AM", recipients: 3, nextRun: "Nov 11, 2024" },
                    { name: "Monthly Payroll Report", schedule: "1st of every month", recipients: 5, nextRun: "Dec 1, 2024" },
                    { name: "Quarterly Performance Review", schedule: "Last day of quarter", recipients: 8, nextRun: "Dec 31, 2024" },
                  ].map((scheduled, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{scheduled.name}</h4>
                        <Button variant="outline" size="sm">Edit Schedule</Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <p>Schedule: {scheduled.schedule}</p>
                          <p>Recipients: {scheduled.recipients}</p>
                        </div>
                        <div>
                          <p>Next Run: {scheduled.nextRun}</p>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Report Analytics</CardTitle>
                <CardDescription>Usage statistics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Most Popular Reports</h4>
                    {[
                      { name: "Attendance Summary", downloads: 342, percentage: 85 },
                      { name: "Payroll Register", downloads: 289, percentage: 72 },
                      { name: "Performance Dashboard", downloads: 234, percentage: 58 },
                    ].map((popular, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{popular.name}</p>
                          <p className="text-sm text-gray-500">{popular.downloads} downloads</p>
                        </div>
                        <div className="text-right">
                          <div className="w-16 h-2 bg-gray-200 rounded">
                            <div 
                              className="h-2 bg-blue-500 rounded" 
                              style={{ width: `${popular.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Report Categories</h4>
                    {[
                      { category: "Time & Attendance", count: 156, color: "bg-blue-500" },
                      { category: "Payroll", count: 89, color: "bg-green-500" },
                      { category: "Performance", count: 67, color: "bg-purple-500" },
                      { category: "Analytics", count: 45, color: "bg-orange-500" },
                    ].map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded ${category.color}`} />
                          <span>{category.category}</span>
                        </div>
                        <span className="font-medium">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <DetailsPanel
          title="Report Details"
          isEmpty={!selectedReport}
          emptyMessage="Select a report to view detailed information"
        >
          {selectedReport && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedReport.name}</h3>
              <p className="text-gray-600">{selectedReport.description}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Report Type</p>
                  <p className="font-medium">{selectedReport.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={
                    selectedReport.status === "Ready" ? "secondary" : 
                    selectedReport.status === "Processing" ? "default" : "outline"
                  }>
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Generated</p>
                  <p className="font-medium">{selectedReport.lastGenerated}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">File Size</p>
                  <p className="font-medium">{selectedReport.size}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button className="w-full" variant="outline">Schedule Report</Button>
                <Button className="w-full" variant="outline">Share Report</Button>
              </div>
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default ReportsManagement;
