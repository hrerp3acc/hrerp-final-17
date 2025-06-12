
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Users, TrendingUp, Calendar, DollarSign, UserPlus, UserMinus, Clock, Target } from 'lucide-react';

const WorkforceAnalytics = () => {
  // Empty data arrays - will be populated when real data is available
  const data: any[] = [];
  const genderData: any[] = [];
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>Total Employees</span>
            </CardTitle>
            <CardDescription>As of today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span>No data available</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-gray-500" />
              <span>New Hires</span>
            </CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>No hires yet</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserMinus className="w-4 h-4 text-gray-500" />
              <span>Employee Attrition</span>
            </CardTitle>
            <CardDescription>This year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span>No attrition data</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Avg. Tenure</span>
            </CardTitle>
            <CardDescription>Company average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">--</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Target className="w-4 h-4 text-gray-400" />
              <span>Insufficient data</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList>
          <TabsTrigger value="employees">Employee Trends</TabsTrigger>
          <TabsTrigger value="diversity">Diversity & Inclusion</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Growth & Attrition</CardTitle>
              <CardDescription>Monthly trends in employee numbers and attrition rates.</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workforce data available</h3>
              <p className="text-gray-600">
                Employee growth and attrition charts will appear here once employee data is added to the system.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diversity">
          <Card>
            <CardHeader>
              <CardTitle>Diversity & Inclusion</CardTitle>
              <CardDescription>Employee diversity metrics and analytics.</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No diversity data available</h3>
              <p className="text-gray-600">
                Diversity metrics will be displayed here once employee demographic data is collected.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Employee performance analytics and trends.</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No performance data available</h3>
              <p className="text-gray-600">
                Performance metrics and trends will appear here once performance reviews are conducted.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkforceAnalytics;
