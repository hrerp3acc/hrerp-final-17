
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCompliance } from '@/hooks/useCompliance';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, FileText,
  Search, Filter, Download, Plus, Eye, RefreshCw
} from 'lucide-react';

const ComplianceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    complianceItems, 
    auditTrail, 
    policyAcknowledgments, 
    loading, 
    getComplianceStats,
    refreshCompliance
  } = useCompliance();

  const stats = getComplianceStats();

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

  const filteredItems = complianceItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600">Monitor and manage regulatory compliance across all HR functions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={refreshCompliance}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Requirement
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requirements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-green-600">{stats.complianceRate}% compliance rate</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
                <p className="text-sm text-gray-500">Meeting standards</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-red-600">{stats.actionRequired}</p>
                <p className="text-sm text-gray-500">High priority items</p>
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
                <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
                <p className="text-sm text-gray-500">Pending assessment</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Tabs */}
      <Tabs defaultValue="requirements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search compliance requirements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Requirements List */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getRiskColor(item.risk_level)}>
                          {item.risk_level} Risk
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Last Review:</span> {item.last_review}
                      </div>
                      <div>
                        <span className="font-medium">Next Review:</span> {item.next_review}
                      </div>
                      <div>
                        <span className="font-medium">Documents:</span> {item.documents_count}
                      </div>
                      <div>
                        <span className="font-medium">Risk Level:</span> {item.risk_level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Acknowledgments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policyAcknowledgments.map((policy) => (
                  <div key={policy.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{policy.policy_name}</h4>
                      <Badge variant="outline">
                        {policy.percentage}% Complete
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Total Employees:</span>
                        <div className="font-medium">{policy.total_employees}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Acknowledged:</span>
                        <div className="font-medium text-green-600">{policy.acknowledged_count}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Pending:</span>
                        <div className="font-medium text-red-600">{policy.pending_count}</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${policy.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditTrail.map((audit) => (
                  <div key={audit.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <div className="font-medium text-sm">{audit.action}</div>
                          <div className="text-sm text-gray-600">{audit.item}</div>
                          <div className="text-xs text-gray-500">{audit.details}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>{audit.date}</div>
                        <div className="text-xs">{audit.user_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Training</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Compliance training management coming soon...</p>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceManagement;
