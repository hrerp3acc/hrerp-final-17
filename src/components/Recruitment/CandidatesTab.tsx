
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, Mail, Phone, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CandidatesTabProps {
  candidates: any[];
  setSelectedCandidate: (candidate: any) => void;
}

const CandidatesTab = ({ candidates, setSelectedCandidate }: CandidatesTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <div className="flex items-center space-x-4 mb-6">
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
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {candidate.candidate_name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{candidate.candidate_name}</h3>
                        <p className="text-sm text-gray-600">Applied {formatDistanceToNow(new Date(candidate.applied_at))} ago</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(candidate.status)}>
                      {candidate.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{candidate.candidate_email}</span>
                    </div>
                    {candidate.candidate_phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{candidate.candidate_phone}</span>
                      </div>
                    )}
                    {candidate.resume_url && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <FileText className="w-4 h-4" />
                        <span>Resume Available</span>
                      </div>
                    )}
                  </div>

                  {candidate.cover_letter && (
                    <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                      {candidate.cover_letter}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Application ID: {candidate.id.slice(0, 8)}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Schedule Interview
                      </Button>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
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
