
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, DollarSign, Megaphone, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BroadcastForm } from './BroadcastForm';

const QuickActions = () => {
  const navigate = useNavigate();
  const [showBroadcast, setShowBroadcast] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate('/employees/add')}
            className="flex flex-col items-center space-y-2 h-20"
            variant="outline"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">Add Employee</span>
          </Button>

          <Button
            onClick={() => navigate('/payroll')}
            className="flex flex-col items-center space-y-2 h-20"
            variant="outline"
          >
            <DollarSign className="w-6 h-6" />
            <span className="text-sm">Payroll Summary</span>
          </Button>

          <Dialog open={showBroadcast} onOpenChange={setShowBroadcast}>
            <DialogTrigger asChild>
              <Button
                className="flex flex-col items-center space-y-2 h-20"
                variant="outline"
              >
                <Megaphone className="w-6 h-6" />
                <span className="text-sm">Broadcast</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Announcement</DialogTitle>
              </DialogHeader>
              <BroadcastForm onClose={() => setShowBroadcast(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
