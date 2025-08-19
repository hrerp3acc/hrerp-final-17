import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useSupabaseAnalytics } from '@/hooks/useSupabaseAnalytics';
import { useAttendance } from '@/hooks/useAttendance';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, BarChart3, Eye, EyeOff } from 'lucide-react';

interface MetricConfig {
  key: string;
  name: string;
  color: string;
  visible: boolean;
  icon: React.ReactNode;
}

interface DataPoint {
  date: string;
  attendance: number;
  performance: number;
  activity: number;
  leaves: number;
}

const MultiMetricTimeSeriesChart = () => {
  const { events } = useSupabaseAnalytics();
  const { attendanceRecords } = useAttendance();
  const { goals } = usePerformanceManagement();
  
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [data, setData] = useState<DataPoint[]>([]);
  
  const [metrics, setMetrics] = useState<MetricConfig[]>([
    {
      key: 'attendance',
      name: 'Attendance Rate',
      color: 'hsl(var(--chart-1))',
      visible: true,
      icon: <Calendar className="w-4 h-4" />
    },
    {
      key: 'performance',
      name: 'Goal Progress',
      color: 'hsl(var(--chart-2))',
      visible: true,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      key: 'activity',
      name: 'System Activity',
      color: 'hsl(var(--chart-3))',
      visible: true,
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      key: 'leaves',
      name: 'Leave Applications',
      color: 'hsl(var(--chart-4))',
      visible: false,
      icon: <Calendar className="w-4 h-4" />
    }
  ]);

  useEffect(() => {
    generateTimeSeriesData();
  }, [timeRange, events, attendanceRecords, goals]);

  const generateTimeSeriesData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dataPoints: DataPoint[] = [];
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Calculate attendance rate (mock calculation)
      const attendanceCount = attendanceRecords.filter(r => r.date === dateStr).length;
      const attendanceRate = Math.min(100, (attendanceCount / Math.max(1, attendanceRecords.length * 0.1)) * 100);
      
      // Calculate performance progress
      const dailyGoals = goals.filter(g => new Date(g.created_at) <= currentDate);
      const avgProgress = dailyGoals.length > 0 
        ? dailyGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / dailyGoals.length 
        : 0;
      
      // Calculate system activity
      const dailyEvents = events.filter(e => e.created_at.startsWith(dateStr)).length;
      const activityScore = Math.min(100, dailyEvents * 5);
      
      // Calculate leave applications (simulated)
      const leaveScore = Math.random() * 20; // Mock data
      
      dataPoints.push({
        date: dateStr,
        attendance: Math.round(attendanceRate),
        performance: Math.round(avgProgress),
        activity: Math.round(activityScore),
        leaves: Math.round(leaveScore)
      });
    }
    
    setData(dataPoints);
  };

  const toggleMetric = (key: string) => {
    setMetrics(prev => prev.map(metric => 
      metric.key === key 
        ? { ...metric, visible: !metric.visible }
        : metric
    ));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-popover border rounded-lg p-3 shadow-lg"
        >
          <p className="font-medium mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry: any, index: number) => {
            const metric = metrics.find(m => m.key === entry.dataKey);
            if (!metric?.visible) return null;
            
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{metric.name}:</span>
                <span className="font-medium">{entry.value}%</span>
              </div>
            );
          })}
        </motion.div>
      );
    }
    return null;
  };

  const visibleMetrics = metrics.filter(m => m.visible);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Multi-Metric Analytics
          </CardTitle>
          
          <div className="flex flex-wrap gap-2">
            {/* Time Range Selector */}
            <div className="flex rounded-lg border">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={timeRange === range ? 'default' : 'ghost'}
                  onClick={() => setTimeRange(range)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {range}
                </Button>
              ))}
            </div>
            
            {/* Chart Type Selector */}
            <div className="flex rounded-lg border">
              <Button
                size="sm"
                variant={chartType === 'area' ? 'default' : 'ghost'}
                onClick={() => setChartType('area')}
                className="rounded-none rounded-l-lg"
              >
                Area
              </Button>
              <Button
                size="sm"
                variant={chartType === 'line' ? 'default' : 'ghost'}
                onClick={() => setChartType('line')}
                className="rounded-none rounded-r-lg"
              >
                Line
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Metric toggles */}
        <div className="flex flex-wrap gap-2 mb-6">
          {metrics.map((metric) => (
            <motion.button
              key={metric.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleMetric(metric.key)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border transition-all ${
                metric.visible 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-muted bg-muted/10 text-muted-foreground'
              }`}
            >
              {metric.icon}
              {metric.name}
              {metric.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </motion.button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {visibleMetrics.map((metric) => (
                    <linearGradient key={metric.key} id={`${metric.key}Gradient`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metric.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={metric.color} stopOpacity={0.05}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {visibleMetrics.map((metric) => (
                  <Area
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    stackId="1"
                    stroke={metric.color}
                    fill={`url(#${metric.key}Gradient)`}
                    strokeWidth={2}
                    name={metric.name}
                  />
                ))}
              </AreaChart>
            ) : (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {visibleMetrics.map((metric) => (
                  <Line
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    stroke={metric.color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: metric.color }}
                    activeDot={{ r: 6, fill: metric.color }}
                    name={metric.name}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {visibleMetrics.map((metric) => {
            const values = data.map(d => d[metric.key as keyof DataPoint] as number);
            const average = values.reduce((sum, val) => sum + val, 0) / values.length;
            const trend = values.length > 1 ? values[values.length - 1] - values[0] : 0;
            
            return (
              <div key={metric.key} className="text-center p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="text-lg font-bold">{average.toFixed(1)}%</div>
                <div className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend >= 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiMetricTimeSeriesChart;