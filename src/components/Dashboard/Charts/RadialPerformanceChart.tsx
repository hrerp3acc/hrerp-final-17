import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, Clock, CheckCircle2 } from 'lucide-react';

interface PerformanceMetric {
  label: string;
  value: number;
  target: number;
  color: string;
  icon: React.ReactNode;
}

const RadialPerformanceChart = () => {
  const { goals, loading } = usePerformanceManagement();
  const [selectedMetric, setSelectedMetric] = useState<number>(0);
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0]);

  const metrics: PerformanceMetric[] = [
    {
      label: 'Goals Completed',
      value: goals.filter(g => g.status === 'completed').length,
      target: goals.length,
      color: 'hsl(var(--success))',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      label: 'In Progress',
      value: goals.filter(g => g.status === 'in_progress').length,
      target: goals.length,
      color: 'hsl(var(--warning))',
      icon: <Clock className="w-4 h-4" />
    },
    {
      label: 'Average Progress',
      value: Math.round(goals.reduce((acc, goal) => acc + (goal.progress || 0), 0) / goals.length || 0),
      target: 100,
      color: 'hsl(var(--primary))',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      label: 'On Target',
      value: goals.filter(g => new Date(g.target_date) > new Date()).length,
      target: goals.length,
      color: 'hsl(var(--info))',
      icon: <Target className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    if (!loading) {
      // Animate values with staggered timing
      metrics.forEach((metric, index) => {
        setTimeout(() => {
          setAnimatedValues(prev => {
            const newValues = [...prev];
            newValues[index] = metric.value;
            return newValues;
          });
        }, index * 200);
      });
    }
  }, [goals, loading]);

  const RadialProgress = ({ 
    metric, 
    index, 
    isSelected, 
    onClick 
  }: { 
    metric: PerformanceMetric; 
    index: number; 
    isSelected: boolean;
    onClick: () => void;
  }) => {
    const percentage = metric.target > 0 ? (animatedValues[index] / metric.target) * 100 : 0;
    const radius = 45;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <motion.div
        className={`relative cursor-pointer transition-all duration-300 ${
          isSelected ? 'scale-110' : 'scale-100 hover:scale-105'
        }`}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="hsl(var(--muted))"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          
          {/* Progress circle */}
          <motion.circle
            stroke={metric.color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-2xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
          >
            {animatedValues[index]}
          </motion.div>
          <div className="text-xs text-muted-foreground">
            / {metric.target}
          </div>
        </div>

        {/* Icon indicator */}
        <div
          className="absolute -top-2 -right-2 p-1 rounded-full"
          style={{ backgroundColor: metric.color }}
        >
          <div className="text-white">
            {metric.icon}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-pulse">Loading performance data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {metrics.map((metric, index) => (
            <div key={metric.label} className="text-center space-y-2">
              <RadialProgress
                metric={metric}
                index={index}
                isSelected={selectedMetric === index}
                onClick={() => setSelectedMetric(index)}
              />
              <div className="text-sm font-medium">{metric.label}</div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMetric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-muted/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              {metrics[selectedMetric].icon}
              <h4 className="font-semibold">{metrics[selectedMetric].label}</h4>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedMetric === 0 && "Track completed goals and achievement rate"}
              {selectedMetric === 1 && "Monitor goals currently being worked on"}
              {selectedMetric === 2 && "Overall progress across all active goals"}
              {selectedMetric === 3 && "Goals on track to meet their target dates"}
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="text-2xl font-bold" style={{ color: metrics[selectedMetric].color }}>
                {((metrics[selectedMetric].value / metrics[selectedMetric].target) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                completion rate
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default RadialPerformanceChart;