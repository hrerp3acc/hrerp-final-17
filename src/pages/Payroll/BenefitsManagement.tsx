
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Umbrella, Gift, Plus, Users } from 'lucide-react';

const BenefitsManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Benefits Management</h1>
          <p className="text-gray-600">Manage employee benefits and enrollment</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Benefit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Health Plans</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500">Active plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Insurance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500">Policies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Umbrella className="w-4 h-4 text-green-500" />
              <span>Retirement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500">401k plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>Enrolled</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500">Employees</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="benefits" className="w-full">
        <TabsList>
          <TabsTrigger value="benefits">Available Benefits</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Available Benefits</CardTitle>
              <CardDescription>Manage benefit offerings and packages</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No benefits configured</h3>
              <p className="text-gray-600 mb-6">
                Add benefit plans like health insurance, retirement, and other perks for your employees.
              </p>
              <div className="flex justify-center space-x-3">
                <Button>Add Health Plan</Button>
                <Button variant="outline">Add Insurance</Button>
                <Button variant="outline">Add 401k Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment">
          <Card>
            <CardHeader>
              <CardTitle>Employee Enrollment</CardTitle>
              <CardDescription>Track benefit enrollment and changes</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollment data</h3>
              <p className="text-gray-600 mb-6">
                Employee benefit enrollments will appear here once benefits are configured and employees enroll.
              </p>
              <Button variant="outline">Start Open Enrollment</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Claims Management</CardTitle>
              <CardDescription>Process and track benefit claims</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No claims submitted</h3>
              <p className="text-gray-600">
                Employee benefit claims will be managed here once benefits are active.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Benefit Providers</CardTitle>
              <CardDescription>Manage relationships with benefit providers</CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <Umbrella className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No providers configured</h3>
              <p className="text-gray-600 mb-6">
                Add benefit providers to manage insurance companies, retirement plan administrators, and other vendors.
              </p>
              <Button>Add Provider</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BenefitsManagement;
