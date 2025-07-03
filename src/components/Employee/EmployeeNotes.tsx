
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StickyNote, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type EmployeeNote = Tables<'employee_notes'>;

interface EmployeeNotesProps {
  employeeId: string;
}

const EmployeeNotes = ({ employeeId }: EmployeeNotesProps) => {
  const [notes, setNotes] = useState<EmployeeNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingNote, setEditingNote] = useState<EmployeeNote | null>(null);
  const { toast } = useToast();

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_notes')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [employeeId]);

  const handleDelete = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('employee_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  const getNoteTypeBadge = (noteType: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      general: { variant: 'default', label: 'General' },
      feedback: { variant: 'secondary', label: 'Feedback' },
      disciplinary: { variant: 'destructive', label: 'Disciplinary' },
      achievement: { variant: 'default', label: 'Achievement' }
    };
    
    const config = variants[noteType] || { variant: 'default', label: noteType };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes & Feedback</h3>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
            </DialogHeader>
            <NoteForm 
              employeeId={employeeId} 
              onClose={() => setShowAdd(false)}
              onSuccess={() => {
                fetchNotes();
                setShowAdd(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <StickyNote className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No notes added yet</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{note.title}</h4>
                    {getNoteTypeBadge(note.note_type)}
                    {note.is_confidential && (
                      <Badge variant="destructive">Confidential</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingNote(note)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{note.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(note.created_at || '').toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <NoteForm 
              employeeId={employeeId}
              note={editingNote}
              onClose={() => setEditingNote(null)}
              onSuccess={() => {
                fetchNotes();
                setEditingNote(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface NoteFormProps {
  employeeId: string;
  note?: EmployeeNote;
  onClose: () => void;
  onSuccess: () => void;
}

const NoteForm = ({ employeeId, note, onClose, onSuccess }: NoteFormProps) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    note_type: note?.note_type || 'general',
    is_confidential: note?.is_confidential || false,
    visibility: note?.visibility || 'managers'
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const noteData = {
        employee_id: employeeId,
        title: formData.title,
        content: formData.content,
        note_type: formData.note_type,
        is_confidential: formData.is_confidential,
        visibility: formData.visibility,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      let error;
      if (note) {
        ({ error } = await supabase
          .from('employee_notes')
          .update(noteData)
          .eq('id', note.id));
      } else {
        ({ error } = await supabase
          .from('employee_notes')
          .insert([noteData]));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Note ${note ? 'updated' : 'added'} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: `Failed to ${note ? 'update' : 'add'} note`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="note_type">Type</Label>
        <Select value={formData.note_type} onValueChange={(value) => setFormData(prev => ({ ...prev, note_type: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="disciplinary">Disciplinary</SelectItem>
            <SelectItem value="achievement">Achievement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="visibility">Visibility</Label>
        <Select value={formData.visibility} onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="self">Self Only</SelectItem>
            <SelectItem value="managers">Managers</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
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
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : (note ? 'Update' : 'Add')} Note
        </Button>
      </div>
    </form>
  );
};

export default EmployeeNotes;
