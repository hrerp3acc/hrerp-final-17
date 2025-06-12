
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, CreditCard, FileText, TrendingUp, 
  Calendar, AlertCircle, CheckCircle, Users
} from 'lucide-react';
import DetailsPanel from '@/components/Common/DetailsPanel';

const PayrollManagement = () => {
  const [selectedPayrollItem, setSelectedPayrollItem] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span>Monthly Payroll</span>
              </CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹0</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span>No data available</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Employees Paid</span>
              </CardTitle>
              <CardDescription>Active payroll</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span>No payroll processed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Pending Reviews</span>
              </CardTitle>
              <CardDescription>Requires attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span>No pending items</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Next Payroll</span>
              </CardTitle>
              <CardDescription>Processing date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span>Not scheduled</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payroll" className="w-full">
          <TabsList>
            <TabsTrigger value="payroll">Payroll Processing</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="payroll">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Status</CardTitle>
                <CardDescription>Current payroll cycle overview</CardDescription>
              </CardHeader>
              <CardContent className="p-12 text-center">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll data</h3>
                <p className="text-gray-600 mb-6">
                  Payroll processing data will appear here once you start processing payroll for your organization.
                </p>
                <Button>Start Payroll Setup</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compensation">
            <Card>
              <CardHeader>
                <CardTitle>Compensation Analytics</CardTitle>
                <CardDescription>Salary trends and compensation analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No compensation data</h3>
                <p className="text-gray-600 mb-6">
                  Compensation analytics will be displayed here once employee salary data is available.
                </p>
                <Button variant="outline">Set Up Compensation Plans</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>Benefits Administration</CardTitle>
                <CardDescription>Manage employee benefits</CardDescription>
              </CardHeader>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No benefits configured</h3>
                <p className="text-gray-600 mb-6">
                  Employee benefits data will be shown here once benefit plans are set up and employees are enrolled.
                </p>
                <Button variant="outline">Configure Benefits</Button>
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
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports available</h3>
                <p className="text-gray-600 mb-6">
                  Payroll reports will be available once payroll processing begins.
                </p>
                <Button variant="outline">View Report Templates</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <DetailsPanel
          title="Payroll Details"
          isEmpty={!selectedPayrollItem}
          emptyMessage="Select a payroll item to view detailed information"
        >
          {selectedPayrollItem && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedPayrollItem.department} Department</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Employees</p>
                  <p className="font-medium">{selectedPayrollItem.employees}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant="outline">
                    {selectedPayrollItem.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">{selectedPayrollItem.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg per Employee</p>
                  <p className="font-medium">₹0</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Actions</h4>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">View Details</Button>
                  <Button className="w-full" variant="outline">Generate Report</Button>
                  <Button className="w-full" variant="outline">Send Notifications</Button>
                </div>
              </div>
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default PayrollManagement;
