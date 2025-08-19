import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Users } from 'lucide-react';

interface DepartmentData {
  name: string;
  count: number;
  color: string;
}

interface TimeFrame {
  month: string;
  data: DepartmentData[];
}

const DepartmentGrowthChart = () => {
  const { employees } = useSupabaseEmployees();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeFrames, setTimeFrames] = useState<TimeFrame[]>([]);

  // Generate time-based department data (simulated historical data)
  useEffect(() => {
    if (!employees.length) return;

    const departmentColors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];

    // Group employees by department
    const departmentCounts = employees.reduce((acc, emp) => {
      const dept = emp.position?.split(' ')[0] || 'Other';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate historical data (6 months)
    const frames: TimeFrame[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    months.forEach((month, index) => {
      const data: DepartmentData[] = Object.entries(departmentCounts).map(([dept, count], deptIndex) => ({
        name: dept,
        count: Math.max(1, Math.floor(count * (0.3 + (index + 1) * 0.12))), // Simulate growth
        color: departmentColors[deptIndex % departmentColors.length]
      }));

      // Sort by count for racing effect
      data.sort((a, b) => b.count - a.count);
      
      frames.push({ month, data });
    });

    setTimeFrames(frames);
  }, [employees]);

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying || timeFrames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => {
        if (prev >= timeFrames.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying, timeFrames.length]);

  const currentData = timeFrames[currentFrame]?.data || [];
  const maxCount = Math.max(...currentData.map(d => d.count), 1);

  const handlePlay = () => {
    if (currentFrame >= timeFrames.length - 1) {
      setCurrentFrame(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };

  if (!timeFrames.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Growth</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading department data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Department Growth Race
        </CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePlay}
            disabled={isPlaying}
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPlaying(false)}
            disabled={!isPlaying}
          >
            <Pause className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">
              {timeFrames[currentFrame]?.month} 2024
            </h3>
            <div className="text-sm text-muted-foreground">
              Frame {currentFrame + 1} of {timeFrames.length}
            </div>
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentFrame + 1) / timeFrames.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {currentData.map((item, index) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 35,
                  delay: index * 0.1
                }}
                className="flex items-center gap-4"
              >
                {/* Rank */}
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: item.color }}
                  whileHover={{ scale: 1.1 }}
                >
                  {index + 1}
                </motion.div>

                {/* Department name */}
                <div className="w-24 text-sm font-medium truncate">
                  {item.name}
                </div>

                {/* Animated bar */}
                <div className="flex-1 relative">
                  <motion.div
                    className="h-8 rounded-lg flex items-center px-3"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(item.count / maxCount) * 100}%`,
                      minWidth: '80px'
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <motion.span
                      className="text-white font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {item.count}
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center">
          <div className="text-sm text-muted-foreground">
            Total Employees: {' '}
            <motion.span
              key={currentFrame}
              initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
              animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
              className="font-bold"
            >
              {currentData.reduce((sum, d) => sum + d.count, 0)}
            </motion.span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentGrowthChart;