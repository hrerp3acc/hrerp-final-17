
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface DetailsPanelProps {
  title: string;
  isEmpty: boolean;
  emptyMessage: string;
  children?: React.ReactNode;
}

const DetailsPanel = ({ title, isEmpty, emptyMessage, children }: DetailsPanelProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 max-w-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailsPanel;
