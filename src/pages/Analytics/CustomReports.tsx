
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Plus, Filter } from "lucide-react";
import { useSupabaseReports } from "@/hooks/useSupabaseReports";
import { useAuth } from "@/contexts/AuthContext";

const CustomReports = () => {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const { templates, generatedReports, loading, generateReport } = useSupabaseReports();
  const { user } = useAuth();

  const reportTemplates = [
    { value: "performance", label: "Performance Report" },
    { value: "attendance", label: "Attendance Report" },
    { value: "payroll", label: "Payroll Summary" },
    { value: "training", label: "Training Report" },
    { value: "custom", label: "Custom Report" }
  ];

  const handleGenerateReport = async () => {
    if (!reportName || !reportType || !user) {
      return;
    }

    const reportData = {
      name: reportName,
      description: `${reportType} report generated on ${new Date().toLocaleDateString()}`,
      report_data: {
        type: reportType,
        generated_at: new Date().toISOString(),
        summary: `Sample ${reportType} report data`
      },
      status: 'generated' as const,
      generated_by: user.id,
      template_id: null
    };

    await generateReport(reportData);
    setReportName("");
    setReportType("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Reports</h1>
          <p className="text-gray-600">Create and manage custom analytical reports</p>
        </div>
        <Button onClick={handleGenerateReport} disabled={!reportName || !reportType}>
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
              <Button className="w-full" onClick={handleGenerateReport} disabled={!reportName || !reportType}>
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
            <span>Available Reports ({generatedReports.length})</span>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedReports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reports generated yet. Create your first report above!</p>
            ) : (
              generatedReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{report.name}</h4>
                      <Badge variant="outline">{report.report_data?.type || 'Custom'}</Badge>
                      <Badge variant={report.status === "generated" ? "secondary" : "default"}>
                        {report.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                  <p className="text-xs text-gray-500">Generated: {new Date(report.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
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
                <p className="text-2xl font-bold">{generatedReports.length}</p>
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
                  {generatedReports.filter(r => r.status === "generated").length}
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
                <p className="text-sm text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-orange-600">{templates.length}</p>
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
