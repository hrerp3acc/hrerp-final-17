
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Users, Settings, Plus } from 'lucide-react';

const CompensationPlans = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compensation Plans</h1>
          <p className="text-gray-600">Design and manage employee compensation structures</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span>Active Plans</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Employees Covered</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span>Avg Salary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-orange-500" />
              <span>Pay Grades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList>
          <TabsTrigger value="plans">Compensation Plans</TabsTrigger>
          <TabsTrigger value="grades">Pay Grades</TabsTrigger>
          <TabsTrigger value="benchmarks">Market Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Compensation Plans</CardTitle>
              <CardDescription>Manage salary structures and compensation packages</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No compensation plans</h3>
              <p className="text-gray-600 mb-6">
                Create compensation plans to define salary structures and benefit packages for your organization.
              </p>
              <Button>Create First Plan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Pay Grades</CardTitle>
              <CardDescription>Define pay grade levels and salary ranges</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pay grades defined</h3>
              <p className="text-gray-600 mb-6">
                Set up pay grades to establish consistent salary ranges across your organization.
              </p>
              <Button>Define Pay Grades</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks">
          <Card>
            <CardHeader>
              <CardTitle>Market Benchmarks</CardTitle>
              <CardDescription>Compare compensation with market standards</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No market data available</h3>
              <p className="text-gray-600 mb-6">
                Import or configure market benchmark data to ensure competitive compensation.
              </p>
              <Button variant="outline">Import Market Data</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompensationPlans;
