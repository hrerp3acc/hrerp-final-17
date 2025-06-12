
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, Square, Calendar } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const TimeTracking = () => {
  const { user, isAuthenticated } = useUser();
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [todayHours, setTodayHours] = useState('0h 0m');
  const [timeEntries, setTimeEntries] = useState<any[]>([]);

  // Auto-start tracking when user logs in
  useEffect(() => {
    if (isAuthenticated && user && !isTracking) {
      console.log('User logged in, starting time tracking automatically');
      setIsTracking(true);
      setIsPaused(false);
      setStartTime(new Date());
      setElapsedTime(0);
    }
  }, [isAuthenticated, user]);

  // Auto-stop tracking when user logs out
  useEffect(() => {
    if (!isAuthenticated && isTracking) {
      console.log('User logged out, stopping time tracking');
      handleStopTracking();
    }
  }, [isAuthenticated]);

  // Update current time display
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTracking && !isPaused && startTime) {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000) + elapsedTime;
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        setCurrentTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, isPaused, startTime, elapsedTime]);

  const handleStopTracking = () => {
    if (startTime) {
      const now = new Date();
      const totalElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000) + elapsedTime;
      const hours = Math.floor(totalElapsed / 3600);
      const minutes = Math.floor((totalElapsed % 3600) / 60);
      
      // Add to today's total
      const currentTotalMinutes = parseInt(todayHours.split('h')[0]) * 60 + parseInt(todayHours.split('h')[1].split('m')[0]);
      const newTotalMinutes = currentTotalMinutes + Math.floor(totalElapsed / 60);
      const newHours = Math.floor(newTotalMinutes / 60);
      const newMinutes = newTotalMinutes % 60;
      setTodayHours(`${newHours}h ${newMinutes}m`);
    }
    setIsTracking(false);
    setIsPaused(false);
    setStartTime(null);
    setElapsedTime(0);
    setCurrentTime('00:00:00');
  };

  const handleStartStop = () => {
    if (isTracking) {
      handleStopTracking();
    } else {
      // Start tracking
      setIsTracking(true);
      setIsPaused(false);
      setStartTime(new Date());
      setElapsedTime(0);
    }
  };

  const handlePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      setStartTime(new Date());
    } else {
      // Pause (break time)
      setIsPaused(true);
      if (startTime) {
        const now = new Date();
        setElapsedTime(prev => prev + Math.floor((now.getTime() - startTime.getTime()) / 1000));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
        <p className="text-gray-600">Track your work hours and manage timesheets</p>
        {isAuthenticated && (
          <p className="text-sm text-blue-600 mt-2">
            ✓ Automatic tracking enabled - Timer starts when you log in and pauses during breaks
          </p>
        )}
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
              {isTracking ? (isPaused ? 'On Break' : 'Working') : 'Not Tracking'}
            </h3>
            <p className="text-gray-600">Today's total: {todayHours}</p>
            {isAuthenticated && (
              <p className="text-sm text-gray-500 mt-1">
                {isTracking ? 'Automatically started when you logged in' : 'Ready to track your time'}
              </p>
            )}
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
                {isPaused ? 'Resume' : 'Take Break'}
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
              <p className="text-xl font-bold text-gray-900">0h 0m</p>
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
              <p className="text-xl font-bold text-gray-900">0h 0m</p>
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
              <p className="text-xl font-bold text-gray-900">0h 0m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Time Entries</h3>
        </div>
        <div className="p-12 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries yet</h3>
          <p className="text-gray-600 mb-6">
            Time entries will appear here once you start tracking your work hours.
          </p>
          {!isTracking && (
            <Button onClick={handleStartStop} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Start Tracking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
