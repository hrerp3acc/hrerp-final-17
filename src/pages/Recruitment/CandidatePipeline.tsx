
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecruitment } from "@/hooks/useRecruitment";
import { Users, Search, Filter, Eye, MessageSquare, Calendar } from "lucide-react";

const CandidatePipeline = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { jobApplications, loading } = useRecruitment();

  const candidates = jobApplications || [];
  
  const filteredCandidates = candidates.filter(candidate =>
    candidate.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.candidate_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pipelineStages = [
    { stage: 'Applied', count: candidates.filter(c => c.status === 'applied').length },
    { stage: 'Screening', count: candidates.filter(c => c.status === 'screening').length },
    { stage: 'Interview', count: candidates.filter(c => c.status === 'interview').length },
    { stage: 'Offer', count: candidates.filter(c => c.status === 'offer').length },
    { stage: 'Hired', count: candidates.filter(c => c.status === 'hired').length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Pipeline</h1>
          <p className="text-gray-600">Track and manage candidate progress through hiring stages</p>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {pipelineStages.map((stage, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stage.count}</div>
              <div className="text-sm text-gray-600">{stage.stage}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Candidates</span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No candidates found</p>
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{candidate.candidate_name}</h4>
                        <p className="text-sm text-gray-600">{candidate.candidate_email}</p>
                        {candidate.candidate_phone && (
                          <p className="text-sm text-gray-500">{candidate.candidate_phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Applied: {new Date(candidate.applied_at).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidatePipeline;
