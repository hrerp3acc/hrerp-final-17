
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BarChart3, Download, Calendar, Users, TrendingUp, FileText, Filter } from 'lucide-react';

const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [department, setDepartment] = useState('all');

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', icon: Calendar },
    { id: 'leave', name: 'Leave Analysis', icon: FileText },
    { id: 'performance', name: 'Performance Report', icon: TrendingUp },
    { id: 'headcount', name: 'Headcount Report', icon: Users },
    { id: 'payroll', name: 'Payroll Summary', icon: BarChart3 },
    { id: 'compliance', name: 'Compliance Report', icon: FileText }
  ];

  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const dateRanges = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const quickReports = [
    {
      title: 'Today\'s Attendance',
      value: '142/150',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Pending Leave Requests',
      value: '12',
      change: '-8%',
      trend: 'down'
    },
    {
      title: 'New Hires (This Month)',
      value: '8',
      change: '+25%',
      trend: 'up'
    },
    {
      title: 'Employee Satisfaction',
      value: '4.2/5',
      change: '+0.3',
      trend: 'up'
    }
  ];

  const recentReports = [
    {
      id: '1',
      name: 'Monthly Attendance Report',
      type: 'Attendance',
      generatedBy: 'John Doe',
      date: '2024-06-01',
      status: 'Ready'
    },
    {
      id: '2',
      name: 'Q2 Performance Analysis',
      type: 'Performance',
      generatedBy: 'Sarah Johnson',
      date: '2024-05-30',
      status: 'Ready'
    },
    {
      id: '3',
      name: 'Leave Trends Report',
      type: 'Leave',
      generatedBy: 'Michael Chen',
      date: '2024-05-28',
      status: 'Processing'
    }
  ];

  const generateReport = () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }
    
    console.log('Generating report:', { selectedReport, dateRange, department });
    alert(`Generating ${reportTypes.find(r => r.id === selectedReport)?.name} for ${department === 'all' ? 'all departments' : department} (${dateRange})`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and manage HR reports</p>
        </div>
        <Button onClick={generateReport} className="bg-blue-600 hover:bg-blue-700">
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickReports.map((report, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{report.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{report.value}</p>
                  <p className={`text-sm mt-1 ${report.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {report.change} from last period
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  report.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    report.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Report Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTypes.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReport === report.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <report.icon className={`w-5 h-5 ${
                        selectedReport === report.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <span className={`font-medium ${
                        selectedReport === report.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {report.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <Input type="date" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReport ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">
                    {reportTypes.find(r => r.id === selectedReport)?.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Department: {department === 'all' ? 'All Departments' : department}
                  </p>
                  <p className="text-sm text-gray-600">
                    Period: {dateRanges.find(r => r.value === dateRange)?.label}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900">Will Include:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Summary statistics</li>
                    <li>• Detailed breakdowns</li>
                    <li>• Trend analysis</li>
                    <li>• Export options (PDF, Excel)</li>
                  </ul>
                </div>
                
                <Button onClick={generateReport} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Generate & Download
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Select a report type to see preview
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Report Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Generated By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{report.name}</td>
                    <td className="py-3 px-4 text-gray-600">{report.type}</td>
                    <td className="py-3 px-4 text-gray-600">{report.generatedBy}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(report.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'Ready' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagement;
