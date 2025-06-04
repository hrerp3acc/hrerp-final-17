
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  DollarSign, CreditCard, FileText, TrendingUp, 
  Calendar, AlertCircle, CheckCircle, Users
} from 'lucide-react';

const payrollData = [
  { month: 'Jan', gross: 2800000, net: 2240000, deductions: 560000 },
  { month: 'Feb', gross: 2850000, net: 2280000, deductions: 570000 },
  { month: 'Mar', gross: 2900000, net: 2320000, deductions: 580000 },
  { month: 'Apr', gross: 2950000, net: 2360000, deductions: 590000 },
  { month: 'May', gross: 3000000, net: 2400000, deductions: 600000 },
  { month: 'Jun', gross: 3050000, net: 2440000, deductions: 610000 },
];

const benefitsData = [
  { name: 'Health Insurance', value: 35, color: '#3b82f6' },
  { name: 'Retirement Plan', value: 25, color: '#10b981' },
  { name: 'Dental/Vision', value: 15, color: '#f59e0b' },
  { name: 'Life Insurance', value: 10, color: '#ef4444' },
  { name: 'Other Benefits', value: 15, color: '#8b5cf6' },
];

const PayrollManagement = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span>Monthly Payroll</span>
            </CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$3.05M</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>+1.7% from last month</span>
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
            <div className="text-3xl font-bold">347</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100% processed</span>
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
            <div className="text-3xl font-bold">5</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>2 urgent</span>
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
            <div className="text-3xl font-bold">Nov 15</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span>5 days remaining</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Status</CardTitle>
                  <CardDescription>Current payroll cycle overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { department: "Engineering", employees: 85, status: "Processed", amount: "$1,250,000" },
                      { department: "Sales", employees: 62, status: "Processed", amount: "$850,000" },
                      { department: "Marketing", employees: 45, status: "Processing", amount: "$650,000" },
                      { department: "Operations", employees: 78, status: "Pending", amount: "$720,000" },
                      { department: "Administration", employees: 77, status: "Processed", amount: "$580,000" },
                    ].map((dept, index) => (
                      <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{dept.department}</h4>
                          <p className="text-sm text-gray-500">{dept.employees} employees</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">{dept.amount}</div>
                            <div className="text-sm text-gray-500">Total</div>
                          </div>
                          <Badge variant={
                            dept.status === "Processed" ? "secondary" : 
                            dept.status === "Processing" ? "default" : "outline"
                          }>
                            {dept.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {dept.status === "Processed" ? "View" : "Process"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: "Nov 1", task: "Time & Attendance Review", status: "completed" },
                      { date: "Nov 5", task: "Deductions Calculation", status: "completed" },
                      { date: "Nov 10", task: "Payroll Processing", status: "current" },
                      { date: "Nov 13", task: "Management Approval", status: "pending" },
                      { date: "Nov 15", task: "Payment Distribution", status: "pending" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          item.status === "completed" ? "bg-green-500" :
                          item.status === "current" ? "bg-blue-500" : "bg-gray-300"
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.task}</div>
                          <div className="text-xs text-gray-500">{item.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compensation">
          <Card>
            <CardHeader>
              <CardTitle>Compensation Analytics</CardTitle>
              <CardDescription>Salary trends and compensation analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={payrollData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Bar dataKey="gross" fill="#3b82f6" name="Gross Pay" />
                  <Bar dataKey="net" fill="#10b981" name="Net Pay" />
                  <Bar dataKey="deductions" fill="#ef4444" name="Deductions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Benefits Enrollment</CardTitle>
                <CardDescription>Employee benefits participation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={benefitsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {benefitsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits Administration</CardTitle>
                <CardDescription>Manage employee benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { plan: "Health Insurance Premium", enrolled: 312, total: 347, cost: "$180,000" },
                    { plan: "Dental Coverage", enrolled: 289, total: 347, cost: "$45,000" },
                    { plan: "Vision Insurance", enrolled: 267, total: 347, cost: "$25,000" },
                    { plan: "Life Insurance", enrolled: 298, total: 347, cost: "$35,000" },
                    { plan: "Retirement Contribution", enrolled: 334, total: 347, cost: "$250,000" },
                  ].map((benefit, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{benefit.plan}</h4>
                        <span className="text-sm font-medium">{benefit.cost}/month</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{benefit.enrolled} of {benefit.total} enrolled</span>
                        <span>{Math.round((benefit.enrolled / benefit.total) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Reports</CardTitle>
              <CardDescription>Generate and download payroll reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Monthly Payroll Summary", description: "Complete payroll breakdown", format: "PDF" },
                  { name: "Tax Liability Report", description: "Tax obligations and payments", format: "Excel" },
                  { name: "Benefits Cost Analysis", description: "Benefits expenses by department", format: "PDF" },
                  { name: "Salary Survey Report", description: "Compensation benchmarking", format: "Excel" },
                  { name: "Year-end Tax Forms", description: "W-2 and tax documentation", format: "PDF" },
                  { name: "Payroll Register", description: "Detailed employee pay records", format: "Excel" },
                ].map((report, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{report.format}</Badge>
                        <Button variant="outline" size="sm">Generate</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollManagement;
