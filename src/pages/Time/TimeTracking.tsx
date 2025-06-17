
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Square, Clock, Calendar, BarChart3, Timer } from 'lucide-react';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const TimeTracking = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [description, setDescription] = useState('');
  const [isBillable, setIsBillable] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    timeEntries,
    projects,
    tasks,
    activeEntry,
    loading,
    startTimer,
    pauseTimer,
    stopTimer,
    createTimeEntry,
    getTodayEntries,
    getWeeklyStats
  } = useTimeTracking();

  // Get user's first name from email or user metadata  
  const getUserFirstName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);
    }
    return 'User';
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartTimer = async () => {
    if (!selectedProject) {
      toast({
        title: "Project Required",
        description: "Please select a project before starting the timer",
        variant: "destructive"
      });
      return;
    }

    const success = await startTimer(selectedProject, selectedTask || null, description, isBillable);
    if (success) {
      toast({
        title: "Timer Started",
        description: "Time tracking has begun"
      });
    }
  };

  const handlePauseTimer = async () => {
    if (activeEntry) {
      const success = await pauseTimer(activeEntry.id);
      if (success) {
        toast({
          title: "Timer Paused",
          description: "Time tracking has been paused"
        });
      }
    }
  };

  const handleStopTimer = async () => {
    if (activeEntry) {
      const success = await stopTimer(activeEntry.id);
      if (success) {
        toast({
          title: "Timer Stopped",
          description: "Time entry has been completed"
        });
        // Reset form
        setSelectedProject('');
        setSelectedTask('');
        setDescription('');
      }
    }
  };

  const formatDuration = (hours: number | null) => {
    if (!hours) return '00:00:00';
    const totalMinutes = Math.floor(hours * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const secs = Math.floor((hours * 3600) % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todayEntries = getTodayEntries();
  const weeklyStats = getWeeklyStats();
  const filteredTasks = tasks.filter(task => task.project_id === selectedProject);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading time tracking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-600">Track your work hours and manage projects</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="text-lg font-mono font-semibold text-gray-900">{currentTime}</p>
        </div>
      </div>

      {/* Timer Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Project and Task Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
              <Select value={selectedProject} onValueChange={setSelectedProject} disabled={!!activeEntry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
              <Select value={selectedTask} onValueChange={setSelectedTask} disabled={!!activeEntry || !selectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a task (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Textarea
              placeholder="What are you working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!!activeEntry}
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isBillable}
                  onChange={(e) => setIsBillable(e.target.checked)}
                  disabled={!!activeEntry}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Billable</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              {activeEntry ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">
                      {activeEntry.status === 'paused' ? 'Paused' : 'Active'}
                    </span>
                  </div>
                  
                  {activeEntry.status === 'active' ? (
                    <Button onClick={handlePauseTimer} variant="outline" size="sm">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={handleStartTimer} variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  
                  <Button onClick={handleStopTimer} variant="destructive" size="sm">
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </div>
              ) : (
                <Button onClick={handleStartTimer} className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Hours</p>
              <p className="font-semibold text-gray-900">
                {formatDuration(todayEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="font-semibold text-gray-900">
                {formatDuration(weeklyStats.totalHours)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Entries Today</p>
              <p className="font-semibold text-gray-900">{todayEntries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Time Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Today's Time Entries</h3>
        </div>
        
        {todayEntries.length === 0 ? (
          <div className="p-12 text-center">
            <Timer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries yet</h3>
            <p className="text-gray-600">Start tracking your time to see entries here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {todayEntries.map((entry) => (
              <div key={entry.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {projects.find(p => p.id === entry.project_id)?.name || 'Unknown Project'}
                      </h4>
                      {entry.task_id && (
                        <span className="text-sm text-gray-500">
                          • {tasks.find(t => t.id === entry.task_id)?.name}
                        </span>
                      )}
                      {entry.is_billable && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Billable
                        </span>
                      )}
                    </div>
                    {entry.description && (
                      <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(entry.start_time).toLocaleTimeString()} - {
                        entry.end_time 
                          ? new Date(entry.end_time).toLocaleTimeString()
                          : 'In Progress'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatDuration(entry.total_hours)}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      entry.status === 'active' ? 'bg-green-100 text-green-800' :
                      entry.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracking;
