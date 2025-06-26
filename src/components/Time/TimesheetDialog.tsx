
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTimesheets } from '@/hooks/useTimesheets';
import { Plus, Calendar } from 'lucide-react';

const TimesheetDialog = () => {
  const { toast } = useToast();
  const { createTimesheet } = useTimesheets();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    weekStartDate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.weekStartDate) {
      toast({
        title: "Validation Error",
        description: "Please select a week start date.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate week end date (6 days after start date)
      const startDate = new Date(formData.weekStartDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const timesheetData = {
        week_start_date: formData.weekStartDate,
        week_end_date: endDate.toISOString().split('T')[0],
        notes: formData.notes || null,
      };

      await createTimesheet(timesheetData);

      setFormData({
        weekStartDate: '',
        notes: '',
      });
      setOpen(false);
    } catch (error) {
      console.error('Error creating timesheet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Timesheet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Create New Timesheet</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="weekStartDate">Week Start Date *</Label>
            <Input
              id="weekStartDate"
              type="date"
              value={formData.weekStartDate}
              onChange={(e) => setFormData(prev => ({ ...prev, weekStartDate: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Select the Monday of the week you want to create a timesheet for
            </p>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes for this timesheet..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Timesheet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimesheetDialog;
