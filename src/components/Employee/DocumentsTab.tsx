
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type EmployeeDocument = Tables<'employee_documents'>;

interface DocumentsTabProps {
  employeeId: string;
}

const DocumentsTab = ({ employeeId }: DocumentsTabProps) => {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [employeeId]);

  const handleDownload = async (document: EmployeeDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.document_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <DocumentUploadForm 
              employeeId={employeeId} 
              onClose={() => setShowUpload(false)}
              onSuccess={() => {
                fetchDocuments();
                setShowUpload(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {documents.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No documents uploaded yet</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          documents.map((document) => (
            <Card key={document.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{document.document_name}</h4>
                    <p className="text-sm text-gray-600">{document.document_type}</p>
                    {document.expiry_date && (
                      <p className="text-xs text-orange-600">
                        Expires: {new Date(document.expiry_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {document.is_confidential && (
                    <Badge variant="destructive">Confidential</Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

interface DocumentUploadFormProps {
  employeeId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DocumentUploadForm = ({ employeeId, onClose, onSuccess }: DocumentUploadFormProps) => {
  const [formData, setFormData] = useState({
    document_name: '',
    document_type: '',
    is_confidential: false,
    expiry_date: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${employeeId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document metadata
      const { error } = await supabase
        .from('employee_documents')
        .insert([{
          employee_id: employeeId,
          document_name: formData.document_name,
          document_type: formData.document_type,
          file_url: uploadData.path,
          file_size: file.size,
          is_confidential: formData.is_confidential,
          expiry_date: formData.expiry_date || null,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="file">Select File</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </div>

      <div>
        <Label htmlFor="document_name">Document Name</Label>
        <Input
          id="document_name"
          value={formData.document_name}
          onChange={(e) => setFormData(prev => ({ ...prev, document_name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="document_type">Document Type</Label>
        <Select value={formData.document_type} onValueChange={(value) => setFormData(prev => ({ ...prev, document_type: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="resume">Resume</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
            <SelectItem value="id_proof">ID Proof</SelectItem>
            <SelectItem value="address_proof">Address Proof</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
        <Input
          id="expiry_date"
          type="date"
          value={formData.expiry_date}
          onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_confidential"
          checked={formData.is_confidential}
          onChange={(e) => setFormData(prev => ({ ...prev, is_confidential: e.target.checked }))}
        />
        <Label htmlFor="is_confidential">Mark as Confidential</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </form>
  );
};

export default DocumentsTab;
