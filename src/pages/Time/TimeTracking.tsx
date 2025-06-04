
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, Square, Calendar } from 'lucide-react';

const TimeTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:23:45');
  const [todayHours, setTodayHours] = useState('7h 23m');

  const handleStartStop = () => {
    if (isTracking) {
      setIsTracking(false);
      setIsPaused(false);
    } else {
      setIsTracking(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const recentEntries = [
    { date: '2024-06-04', project: 'HR System Development', hours: '8h 15m', status: 'completed' },
    { date: '2024-06-03', project: 'Team Meeting', hours: '1h 30m', status: 'completed' },
    { date: '2024-06-03', project: 'Code Review', hours: '2h 45m', status: 'completed' },
    { date: '2024-06-02', project: 'Documentation', hours: '3h 20m', status: 'completed' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
        <p className="text-gray-600">Track your work hours and manage timesheets</p>
      </div>

      {/* Time Tracker Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="text-white">
              <Clock className="w-8 h-8 mb-2 mx-auto" />
              <div className="text-xl font-bold">{currentTime}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isTracking ? (isPaused ? 'Timer Paused' : 'Timer Running') : 'Ready to Start'}
            </h3>
            <p className="text-gray-600">Today's total: {todayHours}</p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleStartStop}
              className={`px-8 py-3 ${
                isTracking 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isTracking ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            {isTracking && (
              <Button
                onClick={handlePause}
                variant="outline"
                className="px-8 py-3"
              >
                <Pause className="w-4 h-4 mr-2" />
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-xl font-bold text-gray-900">38h 15m</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl font-bold text-gray-900">156h 42m</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average/Day</p>
              <p className="text-xl font-bold text-gray-900">7h 48m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Time Entries</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentEntries.map((entry, index) => (
            <div key={index} className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{entry.project}</h4>
                <p className="text-sm text-gray-600">{entry.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{entry.hours}</p>
                <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
