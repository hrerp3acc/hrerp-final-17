
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paperclip, Download, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type LeaveAttachment = Tables<'leave_attachments'>;

interface LeaveAttachmentsProps {
  leaveApplicationId: string;
  canEdit?: boolean;
}

const LeaveAttachments = ({ leaveApplicationId, canEdit = false }: LeaveAttachmentsProps) => {
  const [attachments, setAttachments] = useState<LeaveAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  const fetchAttachments = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_attachments')
        .select('*')
        .eq('leave_application_id', leaveApplicationId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attachments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [leaveApplicationId]);

  const handleDownload = async (attachment: LeaveAttachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(attachment.file_url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      toast({
        title: "Error",
        description: "Failed to download attachment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) return;

    try {
      const { error } = await supabase
        .from('leave_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attachment deleted successfully",
      });
      
      fetchAttachments();
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast({
        title: "Error",
        description: "Failed to delete attachment",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading attachments...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Attachments</h4>
        {canEdit && (
          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Attachment</DialogTitle>
              </DialogHeader>
              <UploadForm 
                leaveApplicationId={leaveApplicationId}
                onClose={() => setShowUpload(false)}
                onSuccess={() => {
                  fetchAttachments();
                  setShowUpload(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {attachments.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-6">
            <div className="text-center">
              <Paperclip className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No attachments</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <Card key={attachment.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{attachment.file_name}</p>
                    <p className="text-xs text-gray-500">
                      {attachment.file_size && `${Math.round(attachment.file_size / 1024)} KB`} • 
                      {new Date(attachment.uploaded_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(attachment)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(attachment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

interface UploadFormProps {
  leaveApplicationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadForm = ({ leaveApplicationId, onClose, onSuccess }: UploadFormProps) => {
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
      const fileName = `leave-attachments/${leaveApplicationId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save attachment metadata
      const { error } = await supabase
        .from('leave_attachments')
        .insert([{
          leave_application_id: leaveApplicationId,
          file_name: file.name,
          file_url: uploadData.path,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attachment uploaded successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast({
        title: "Error",
        description: "Failed to upload attachment",
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

export default LeaveAttachments;
