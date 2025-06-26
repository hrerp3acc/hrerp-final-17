
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useOnboarding } from '@/hooks/useOnboarding';
import { useSettings } from '@/hooks/useSettings';
import { 
  ArrowRight, ArrowLeft, Check, X, 
  User, Bell, Compass, Sparkles 
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const { progress, steps, completeStep, skipOnboarding } = useOnboarding();
  const { updateSettings } = useSettings();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = steps[currentStepIndex];
  const progressPercent = ((progress?.completed_steps?.length || 0) / steps.length) * 100;

  const handleNextStep = async () => {
    if (currentStep) {
      await completeStep(currentStep.id);
    }
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSkip = async () => {
    await skipOnboarding();
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep?.component) {
      case 'welcome':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Welcome to HR Management</h3>
            <p className="text-gray-600">
              Let's get you started with your new HR management system. 
              This quick setup will help you configure everything you need.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                This setup will take about 2-3 minutes to complete.
              </p>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-center">Set Up Your Profile</h3>
            <p className="text-gray-600 text-center">
              Complete your profile information to personalize your experience.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Personal Information</span>
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Contact Details</span>
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Profile Picture</span>
                <Badge variant="outline">Optional</Badge>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-center">Configure Notifications</h3>
            <p className="text-gray-600 text-center">
              Choose how you want to receive updates and stay informed.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Get updates via email</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Browser notifications</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Leave Requests</p>
                  <p className="text-sm text-gray-500">Updates on leave status</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Compass className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-center">Explore Key Features</h3>
            <p className="text-gray-600 text-center">
              Here are the main features available to you in the system.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg text-center">
                <div className="w-8 h-8 bg-blue-100 rounded mx-auto mb-2 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Employee Directory</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <div className="w-8 h-8 bg-green-100 rounded mx-auto mb-2 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm font-medium">Leave Management</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <div className="w-8 h-8 bg-orange-100 rounded mx-auto mb-2 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-orange-600" />
                </div>
                <p className="text-sm font-medium">Performance</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <div className="w-8 h-8 bg-purple-100 rounded mx-auto mb-2 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Analytics</p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-800 font-medium">
                🎉 You're all set! Welcome to your HR management system.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!progress || progress.is_completed) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Getting Started</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            Step {currentStepIndex + 1} of {steps.length}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Progress value={progressPercent} className="w-full" />
          
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={handleSkip}>
                Skip Setup
              </Button>
              <Button onClick={handleNextStep}>
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
