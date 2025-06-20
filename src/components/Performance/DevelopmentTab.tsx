
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';

export const DevelopmentTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Plans</CardTitle>
        <CardDescription>Career development and skill enhancement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No development plans</h3>
          <p className="text-gray-600 mb-6">
            Create development plans to enhance your skills and advance your career.
          </p>
          <Button>Create Development Plan</Button>
        </div>
      </CardContent>
    </Card>
  );
};
