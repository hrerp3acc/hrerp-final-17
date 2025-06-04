
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, FileText,
  Search, Filter, Download, Plus, Eye
} from 'lucide-react';

const ComplianceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const complianceItems = [
    {
      id: 1,
      category: 'Labor Law',
      title: 'Equal Employment Opportunity',
      status: 'Compliant',
      lastReview: '2024-01-15',
      nextReview: '2024-07-15',
      risk: 'Low',
      documents: 3
    },
    {
      id: 2,
      category: 'Safety',
      title: 'Workplace Safety Training',
      status: 'Action Required',
      lastReview: '2024-02-01',
      nextReview: '2024-08-01',
      risk: 'Medium',
      documents: 5
    },
    {
      id: 3,
      category: 'Data Privacy',
      title: 'GDPR Compliance',
      status: 'Under Review',
      lastReview: '2024-01-20',
      nextReview: '2024-07-20',
      risk: 'High',
      documents: 8
    },
    {
      id: 4,
      category: 'Financial',
      title: 'Payroll Tax Compliance',
      status: 'Compliant',
      lastReview: '2024-02-15',
      nextReview: '2024-08-15',
      risk: 'Low',
      documents: 12
    }
  ];

  const auditTrail = [
    {
      date: '2024-02-15',
      action: 'Policy Updated',
      item: 'Remote Work Policy',
      user: 'Sarah Johnson',
      details: 'Updated section 3.2 - Equipment provision'
    },
    {
      date: '2024-02-14',
      action: 'Compliance Check',
      item: 'Data Privacy Assessment',
      user: 'Michael Chen',
      details: 'Quarterly GDPR compliance review completed'
    },
    {
      date: '2024-02-13',
      action: 'Document Approved',
      item: 'Safety Manual v2.1',
      user: 'Emma Wilson',
      details: 'Annual safety manual update approved'
    }
  ];

  const policyAcknowledgments = [
    {
      policy: 'Code of Conduct',
      totalEmployees: 1335,
      acknowledged: 1298,
      pending: 37,
      percentage: 97.2
    },
    {
      policy: 'Data Privacy Policy',
      totalEmployees: 1335,
      acknowledged: 1245,
      pending: 90,
      percentage: 93.3
    },
    {
      policy: 'Remote Work Policy',
      totalEmployees: 856,
      acknowledged: 812,
      pending: 44,
      percentage: 94.9
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-green-100 text-green-800';
      case 'Action Required': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600">Monitor and manage regulatory compliance across all HR functions</p>
        </div>
        <div className="flex space-x-3">
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
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-green-600">+2 this month</p>
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
                <p className="text-2xl font-bold text-green-600">18</p>
                <p className="text-sm text-gray-500">75% compliance rate</p>
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
                <p className="text-2xl font-bold text-red-600">4</p>
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
                <p className="text-2xl font-bold text-yellow-600">2</p>
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
                {complianceItems.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge className={getRiskColor(item.risk)}>
                          {item.risk} Risk
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
                        <span className="font-medium">Last Review:</span> {item.lastReview}
                      </div>
                      <div>
                        <span className="font-medium">Next Review:</span> {item.nextReview}
                      </div>
                      <div>
                        <span className="font-medium">Documents:</span> {item.documents}
                      </div>
                      <div>
                        <span className="font-medium">Risk Level:</span> {item.risk}
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
                {policyAcknowledgments.map((policy, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{policy.policy}</h4>
                      <Badge variant="outline">
                        {policy.percentage}% Complete
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Total Employees:</span>
                        <div className="font-medium">{policy.totalEmployees}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Acknowledged:</span>
                        <div className="font-medium text-green-600">{policy.acknowledged}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Pending:</span>
                        <div className="font-medium text-red-600">{policy.pending}</div>
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
                {auditTrail.map((audit, index) => (
                  <div key={index} className="p-3 border rounded-lg">
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
                        <div className="text-xs">{audit.user}</div>
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
