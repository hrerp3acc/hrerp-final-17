
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileX } from 'lucide-react';

interface DetailsPanelProps {
  title: string;
  isEmpty: boolean;
  emptyMessage: string;
  children?: React.ReactNode;
}

const DetailsPanel = ({ title, isEmpty, emptyMessage, children }: DetailsPanelProps) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileX className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default DetailsPanel;
