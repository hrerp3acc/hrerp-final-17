
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Settings, Download, RefreshCw } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backTo?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
    variant?: 'outline' | 'ghost' | 'secondary';
  }>;
}

const PageHeader = ({ 
  title, 
  description, 
  showBackButton = false, 
  backTo = '/',
  primaryAction,
  secondaryActions = []
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(backTo)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {secondaryActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={action.onClick}
          >
            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
            {action.label}
          </Button>
        ))}
        
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {primaryAction.icon && <primaryAction.icon className="w-4 h-4 mr-2" />}
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
