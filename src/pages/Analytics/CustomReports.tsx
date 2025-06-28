
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Plus, Filter } from "lucide-react";

const CustomReports = () => {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");

  const availableReports = [
    {
      id: 1,
      name: "Employee Performance Summary",
      type: "Performance",
      description: "Comprehensive performance analysis across departments",
      lastGenerated: "2024-01-15",
      status: "Ready"
    },
    {
      id: 2,
      name: "Attendance Trends Analysis",
      type: "Attendance",
      description: "Monthly attendance patterns and insights",
      lastGenerated: "2024-01-10",
      status: "Ready"
    },
    {
      id: 3,
      name: "Payroll Cost Analysis",
      type: "Payroll",
      description: "Detailed breakdown of payroll expenses",
      lastGenerated: "2024-01-05",
      status: "Processing"
    },
    {
      id: 4,
      name: "Training Completion Report",
      type: "Training",
      description: "Employee training progress and completion rates",
      lastGenerated: "2024-01-12",
      status: "Ready"
    }
  ];

  const reportTemplates = [
    { value: "performance", label: "Performance Report" },
    { value: "attendance", label: "Attendance Report" },
    { value: "payroll", label: "Payroll Summary" },
    { value: "training", label: "Training Report" },
    { value: "custom", label: "Custom Report" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Reports</h1>
          <p className="text-gray-600">Create and manage custom analytical reports</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Report
        </Button>
      </div>

      {/* Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Report Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Report Name</label>
              <Input 
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Available Reports</span>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium">{report.name}</h4>
                    <Badge variant="outline">{report.type}</Badge>
                    <Badge variant={report.status === "Ready" ? "secondary" : "default"}>
                      {report.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                <p className="text-xs text-gray-500">Last generated: {report.lastGenerated}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold">{availableReports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready Reports</p>
                <p className="text-2xl font-bold text-green-600">
                  {availableReports.filter(r => r.status === "Ready").length}
                </p>
              </div>
              <Download className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-orange-600">
                  {availableReports.filter(r => r.status === "Processing").length}
                </p>
              </div>
              <Filter className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomReports;
