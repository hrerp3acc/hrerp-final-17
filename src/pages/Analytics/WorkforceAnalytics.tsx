import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Users, TrendingUp, Calendar, DollarSign, UserPlus, UserMinus, Clock, Target } from 'lucide-react';

const data = [
  { name: 'Jan', employees: 40, attrition: 24 },
  { name: 'Feb', employees: 30, attrition: 13 },
  { name: 'Mar', employees: 20, attrition: 9 },
  { name: 'Apr', employees: 27, attrition: 39 },
  { name: 'May', employees: 18, attrition: 48 },
  { name: 'Jun', employees: 23, attrition: 38 },
  { name: 'Jul', employees: 34, attrition: 43 },
  { name: 'Aug', employees: 40, attrition: 24 },
  { name: 'Sep', employees: 30, attrition: 13 },
  { name: 'Oct', employees: 20, attrition: 9 },
  { name: 'Nov', employees: 27, attrition: 39 },
  { name: 'Dec', employees: 18, attrition: 48 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const WorkforceAnalytics = () => {
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
            <div className="text-3xl font-bold">350</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>+5% from last month</span>
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
            <div className="text-3xl font-bold">15</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Updated daily</span>
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
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-red-500" />
              <span>Cost savings</span>
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
            <div className="text-3xl font-bold">3.2 Years</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Target className="w-4 h-4 text-yellow-500" />
              <span>Improving steadily</span>
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
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" stackId="a" fill="#8884d8" name="Employees" />
                  <Bar dataKey="attrition" stackId="a" fill="#82ca9d" name="Attrition" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diversity">
          <Card>
            <CardHeader>
              <CardTitle>Gender Diversity</CardTitle>
              <CardDescription>Distribution of employees by gender.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[{name: 'Male', value: 150}, {name: 'Female', value: 200}]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Scores Over Time</CardTitle>
              <CardDescription>Trend of average performance scores over the last year.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attrition" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkforceAnalytics;
