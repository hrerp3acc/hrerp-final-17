
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Users } from 'lucide-react';

interface CandidatesTabProps {
  candidates: any[];
  setSelectedCandidate: (candidate: any) => void;
}

const CandidatesTab = ({ candidates, setSelectedCandidate }: CandidatesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Pipeline</CardTitle>
        <CardDescription>Track candidates through the hiring process</CardDescription>
      </CardHeader>
      <CardContent>
        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
            <p className="text-gray-600 mb-6">
              Candidates will appear here once you start receiving applications.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search candidates..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  {/* Candidate content */}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidatesTab;
