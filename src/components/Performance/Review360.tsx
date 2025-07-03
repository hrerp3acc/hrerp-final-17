
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, MessageSquare, Star, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ReviewParticipant = Tables<'review_participants'>;
type Employee = Tables<'employees'>;

interface Review360Props {
  reviewId: string;
  employeeId: string;
}

const Review360 = ({ reviewId, employeeId }: Review360Props) => {
  const [participants, setParticipants] = useState<(ReviewParticipant & { employee?: Employee })[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const { toast } = useToast();

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('review_participants')
        .select(`
          *,
          employee:employees(*)
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch review participants",
        variant: "destructive"
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active')
        .order('first_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchParticipants(), fetchEmployees()]);
  }, [reviewId]);

  const getParticipantTypeColor = (type: string) => {
    switch (type) {
      case 'self': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'peer': return 'bg-yellow-100 text-yellow-800';
      case 'subordinate': return 'bg-purple-100 text-purple-800';
      case 'client': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionStats = () => {
    const total = participants.length;
    const completed = participants.filter(p => p.feedback_submitted).length;
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const stats = getCompletionStats();

  if (loading) {
    return <div>Loading 360-degree review...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">360-Degree Review</h3>
        <Dialog open={showAddParticipant} onOpenChange={setShowAddParticipant}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Participant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Review Participant</DialogTitle>
            </DialogHeader>
            <AddParticipantForm 
              reviewId={reviewId}
              employeeId={employeeId}
              employees={employees}
              existingParticipants={participants}
              onClose={() => setShowAddParticipant(false)}
              onSuccess={() => {
                fetchParticipants();
                setShowAddParticipant(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Review Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Feedback Completion</span>
            <span>{stats.completed} of {stats.total} participants</span>
          </div>
          <Progress value={stats.percentage} className="w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.total - stats.completed}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {participants.filter(p => p.rating).length}
              </div>
              <div className="text-sm text-gray-600">With Ratings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      <div className="space-y-4">
        <h4 className="font-medium">Review Participants</h4>
        {participants.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No participants added yet</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          participants.map((participant) => (
            <Card key={participant.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    participant.feedback_submitted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div>
                    <h5 className="font-medium">
                      {participant.employee ? 
                        `${participant.employee.first_name} ${participant.employee.last_name}` :
                        'Unknown Employee'
                      }
                    </h5>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getParticipantTypeColor(participant.participant_type)}>
                        {participant.participant_type}
                      </Badge>
                      {participant.feedback_submitted && (
                        <Badge variant="outline" className="text-green-600">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Feedback Submitted
                        </Badge>
                      )}
                      {participant.rating && (
                        <Badge variant="outline" className="text-yellow-600">
                          <Star className="w-3 h-3 mr-1" />
                          {participant.rating}/5
                        </Badge>
                      )}
                    </div>
                    {participant.submitted_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(participant.submitted_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {participant.feedback_content && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        View Feedback
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Feedback from {participant.employee?.first_name} {participant.employee?.last_name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {participant.rating && (
                          <div>
                            <Label>Overall Rating</Label>
                            <div className="flex items-center space-x-2">
                              <Star className="w-5 h-5 text-yellow-500" />
                              <span className="text-lg font-semibold">{participant.rating}/5</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <Label>Feedback</Label>
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm whitespace-pre-wrap">{participant.feedback_content}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

interface AddParticipantFormProps {
  reviewId: string;
  employeeId: string;
  employees: Employee[];
  existingParticipants: ReviewParticipant[];
  onClose: () => void;
  onSuccess: () => void;
}

const AddParticipantForm = ({ 
  reviewId, 
  employeeId, 
  employees, 
  existingParticipants,
  onClose, 
  onSuccess 
}: AddParticipantFormProps) => {
  const [formData, setFormData] = useState({
    participant_id: '',
    participant_type: 'peer'
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Filter out employees who are already participants
  const availableEmployees = employees.filter(emp => 
    !existingParticipants.some(p => p.participant_id === emp.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('review_participants')
        .insert([{
          review_id: reviewId,
          participant_id: formData.participant_id,
          participant_type: formData.participant_type
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Participant added successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error adding participant:', error);
      toast({
        title: "Error",
        description: "Failed to add participant",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="participant_id">Employee</Label>
        <Select value={formData.participant_id} onValueChange={(value) => setFormData(prev => ({ ...prev, participant_id: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {availableEmployees.map(employee => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.first_name} {employee.last_name} - {employee.position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="participant_type">Participant Type</Label>
        <Select value={formData.participant_type} onValueChange={(value) => setFormData(prev => ({ ...prev, participant_type: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="self">Self</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="peer">Peer</SelectItem>
            <SelectItem value="subordinate">Subordinate</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !formData.participant_id}>
          {saving ? 'Adding...' : 'Add Participant'}
        </Button>
      </div>
    </form>
  );
};

export default Review360;
