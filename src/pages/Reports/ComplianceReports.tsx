
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompliance } from "@/hooks/useCompliance";
import { Shield, AlertTriangle, CheckCircle, Download, Calendar, FileText } from "lucide-react";

const ComplianceReports = () => {
  const { complianceItems, auditTrail, policyAcknowledgments, loading } = useCompliance();
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'action_required': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const complianceStats = {
    total: complianceItems.length,
    compliant: complianceItems.filter(item => item.status === 'compliant').length,
    actionRequired: complianceItems.filter(item => item.status === 'action_required').length,
    underReview: complianceItems.filter(item => item.status === 'under_review').length
  };

  const complianceRate = complianceStats.total > 0 ? 
    Math.round((complianceStats.compliant / complianceStats.total) * 100) : 0;

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
          <h1 className="text-2xl font-bold text-gray-900">Compliance Reports</h1>
          <p className="text-gray-600">Monitor compliance status and generate regulatory reports</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Select Period
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-600">{complianceRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliant Items</p>
                <p className="text-2xl font-bold">{complianceStats.compliant}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-red-600">{complianceStats.actionRequired}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{complianceStats.underReview}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Items */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getRiskColor(item.risk_level)}>
                      {item.risk_level.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Last Review: </span>
                    {new Date(item.last_review).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Next Review: </span>
                    {new Date(item.next_review).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Documents: </span>
                    {item.documents_count}
                  </div>
                  <div>
                    <span className="font-medium">Risk Level: </span>
                    <span className={`font-medium ${
                      item.risk_level === 'high' ? 'text-red-600' : 
                      item.risk_level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {item.risk_level.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Policy Acknowledgments */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Acknowledgment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policyAcknowledgments.map((policy) => (
              <div key={policy.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{policy.policy_name}</h4>
                  <Badge className={policy.percentage >= 95 ? 'bg-green-100 text-green-800' : 
                    policy.percentage >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                    {policy.percentage}% Complete
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Employees: </span>
                    <span className="font-medium">{policy.total_employees}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Acknowledged: </span>
                    <span className="font-medium text-green-600">{policy.acknowledged_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pending: </span>
                    <span className="font-medium text-red-600">{policy.pending_count}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${policy.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditTrail.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{entry.action}</p>
                  <p className="text-sm text-gray-600">{entry.details}</p>
                  <p className="text-xs text-gray-500">by {entry.user_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{entry.date}</p>
                  <Badge variant="outline">{entry.item}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceReports;
