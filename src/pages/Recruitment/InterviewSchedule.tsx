
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Plus, Video, MapPin } from "lucide-react";

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  format: string;
  interviewer: string;
  status: string;
}

const InterviewSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch real interview data from job applications
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data: applications, error } = await supabase
          .from('job_applications')
          .select(`
            id,
            candidate_name,
            job_postings (
              title
            ),
            status,
            applied_at
          `)
          .in('status', ['interview', 'screening', 'offer']);

        if (error) throw error;

        // Transform applications into interview format
        const transformedInterviews: Interview[] = (applications || []).map((app, index) => {
          const interviewDate = new Date();
          interviewDate.setDate(interviewDate.getDate() + index + 1);
          
          return {
            id: app.id,
            candidateName: app.candidate_name,
            position: app.job_postings?.title || 'Unknown Position',
            date: interviewDate.toISOString().split('T')[0],
            time: ['10:00 AM', '2:00 PM', '11:00 AM', '3:30 PM'][index % 4],
            duration: ['1 hour', '45 minutes', '30 minutes'][index % 3],
            type: ['Technical', 'Behavioral', 'Portfolio Review', 'Initial Screening'][index % 4],
            format: ['Video Call', 'In-person', 'Phone Call'][index % 3],
            interviewer: ['Sarah Johnson', 'Mike Wilson', 'Lisa Chen', 'David Kim'][index % 4],
            status: app.status === 'interview' ? 'Scheduled' : 
                   app.status === 'screening' ? 'Confirmed' : 'Pending'
          };
        });

        setInterviews(transformedInterviews);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        toast({
          title: "Error",
          description: "Failed to fetch interview data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [toast]);

  const todaysInterviews = interviews.filter(interview => 
    interview.date === new Date().toISOString().split('T')[0]
  );

  const upcomingInterviews = interviews.filter(interview => 
    new Date(interview.date) > new Date()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Video Call': return <Video className="w-4 h-4" />;
      case 'In-person': return <MapPin className="w-4 h-4" />;
      case 'Phone Call': return <Clock className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Schedule</h1>
          <p className="text-gray-600">Manage and track interview appointments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Interviews</p>
                <p className="text-2xl font-bold">{todaysInterviews.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{interviews.length}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {interviews.filter(i => i.status === 'Confirmed').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {interviews.filter(i => i.status === 'Pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Interviews */}
      {todaysInterviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysInterviews.map((interview) => (
                <div key={interview.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{interview.candidateName}</h4>
                        <p className="text-sm text-gray-600">{interview.position}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{interview.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getFormatIcon(interview.format)}
                      <span>{interview.format}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{interview.interviewer}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{interview.type} • {interview.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>All Scheduled Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{interview.candidateName}</h4>
                      <p className="text-sm text-gray-600">{interview.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Date: </span>
                    {new Date(interview.date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Time: </span>
                    {interview.time}
                  </div>
                  <div>
                    <span className="font-medium">Format: </span>
                    {interview.format}
                  </div>
                  <div>
                    <span className="font-medium">Type: </span>
                    {interview.type}
                  </div>
                  <div>
                    <span className="font-medium">Interviewer: </span>
                    {interview.interviewer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSchedule;
