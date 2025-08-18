
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCertifications } from "@/hooks/useCertifications";
import { Award, Calendar, Download, ExternalLink, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

const Certifications = () => {
  const { certifications, loading, addCertification, updateCertification, deleteCertification, getCertificationStats } = useCertifications();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    certificate_url: '',
    verification_url: ''
  });

  const stats = getCertificationStats();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCertification(formData);
    setFormData({
      name: '',
      issuer: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      certificate_url: '',
      verification_url: ''
    });
    setIsAddDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
          <p className="text-gray-600">Manage your professional certifications and achievements</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Award className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Certification</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Certification Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="issuer">Issuer</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input
                    id="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="credential_id">Credential ID</Label>
                <Input
                  id="credential_id"
                  value={formData.credential_id}
                  onChange={(e) => setFormData({...formData, credential_id: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="certificate_url">Certificate URL</Label>
                <Input
                  id="certificate_url"
                  type="url"
                  value={formData.certificate_url}
                  onChange={(e) => setFormData({...formData, certificate_url: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="verification_url">Verification URL</Label>
                <Input
                  id="verification_url"
                  type="url"
                  value={formData.verification_url}
                  onChange={(e) => setFormData({...formData, verification_url: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Certification</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-green-500" />
              <span>Active</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-yellow-500" />
              <span>Expiring Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.expiringSoon}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-gray-500" />
              <span>Expired</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.expired}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Certifications</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="all">All Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {certifications.filter(cert => cert.status === 'active').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications
                .filter(cert => cert.status === 'active')
                .map((cert) => (
                  <Card key={cert.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{cert.name}</CardTitle>
                          <CardDescription>{cert.issuer}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-green-600">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {cert.issue_date && (
                          <p className="text-sm text-gray-600">
                            Issued: {format(new Date(cert.issue_date), 'MMM dd, yyyy')}
                          </p>
                        )}
                        {cert.expiry_date && (
                          <p className="text-sm text-gray-600">
                            Expires: {format(new Date(cert.expiry_date), 'MMM dd, yyyy')}
                          </p>
                        )}
                        {(cert as any).credential_id && (
                          <p className="text-sm text-gray-600">
                            ID: {(cert as any).credential_id}
                          </p>
                        )}
                        <div className="flex space-x-2 mt-4">
                          {cert.certificate_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                          {(cert as any).verification_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={(cert as any).verification_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Verify
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active certifications</h3>
                <p className="text-gray-600 mb-6">
                  You don't have any active certifications. Add your existing certifications to get started.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>Add Certification</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expired">
          {certifications.filter(cert => cert.expiry_date && new Date(cert.expiry_date) <= new Date()).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications
                .filter(cert => cert.expiry_date && new Date(cert.expiry_date) <= new Date())
                .map((cert) => (
                  <Card key={cert.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{cert.name}</CardTitle>
                          <CardDescription>{cert.issuer}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-red-600">Expired</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {cert.issue_date && (
                          <p className="text-sm text-gray-600">
                            Issued: {format(new Date(cert.issue_date), 'MMM dd, yyyy')}
                          </p>
                        )}
                        {cert.expiry_date && (
                          <p className="text-sm text-red-600">
                            Expired: {format(new Date(cert.expiry_date), 'MMM dd, yyyy')}
                          </p>
                        )}
                        <Button size="sm" className="mt-4">Renew Certification</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expired certifications</h3>
                <p className="text-gray-600">
                  Expired certifications will appear here for renewal tracking.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all">
          {certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                        <CardDescription>{cert.issuer}</CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          cert.status === 'active' 
                            ? 'text-green-600' 
                            : cert.expiry_date && new Date(cert.expiry_date) <= new Date()
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }
                      >
                        {cert.status === 'active' 
                          ? 'Active' 
                          : cert.expiry_date && new Date(cert.expiry_date) <= new Date()
                          ? 'Expired'
                          : 'Inactive'
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {cert.issue_date && (
                        <p className="text-sm text-gray-600">
                          Issued: {format(new Date(cert.issue_date), 'MMM dd, yyyy')}
                        </p>
                      )}
                      {cert.expiry_date && (
                        <p className="text-sm text-gray-600">
                          Expires: {format(new Date(cert.expiry_date), 'MMM dd, yyyy')}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-2">
                          {cert.certificate_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteCertification(cert.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications found</h3>
                <p className="text-gray-600 mb-6">
                  Start building your professional credentials by adding your first certification.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>Add Certification</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Certifications;
