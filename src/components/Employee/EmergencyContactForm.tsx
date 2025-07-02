
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface EmergencyContactFormProps {
  formData: {
    emergencyContactName: string;
    emergencyContactPhone: string;
    notes: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const EmergencyContactForm = ({ formData, onInputChange }: EmergencyContactFormProps) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Emergency Contact & Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
            <Input
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(e) => onInputChange('emergencyContactName', e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
            <Input
              id="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={(e) => onInputChange('emergencyContactPhone', e.target.value)}
              placeholder="+1 (555) 987-6543"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => onInputChange('notes', e.target.value)}
            placeholder="Any additional information..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactForm;
