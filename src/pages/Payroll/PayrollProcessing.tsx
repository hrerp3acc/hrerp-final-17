
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Users, FileText, Download, Play } from 'lucide-react';

const PayrollProcessing = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Processing</h1>
          <p className="text-gray-600">Manage payroll runs and employee compensation</p>
        </div>
        <Button>
          <Play className="w-4 h-4 mr-2" />
          Run Payroll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span>Current Period</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-sm text-gray-500">Total payroll</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Employees</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500">To be processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>Next Pay Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">Not scheduled</div>
            <p className="text-sm text-gray-500">Schedule payroll</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Not Started</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current Payroll</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current Payroll Period</CardTitle>
              <CardDescription>No active payroll period</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll in progress</h3>
              <p className="text-gray-600 mb-6">
                Start a new payroll run to process employee payments for the current period.
              </p>
              <Button>Start New Payroll</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>View past payroll runs and payments</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll history</h3>
              <p className="text-gray-600">
                Previous payroll runs will appear here once you start processing payroll.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Reports</CardTitle>
              <CardDescription>Generate and download payroll reports</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports available</h3>
              <p className="text-gray-600 mb-6">
                Payroll reports will be available after processing your first payroll.
              </p>
              <Button variant="outline">Generate Sample Report</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollProcessing;
