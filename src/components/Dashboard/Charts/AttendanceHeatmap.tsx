import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendance } from '@/hooks/useAttendance';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface AttendanceDay {
  date: string;
  value: number;
  status: string;
  hours: number;
}

const AttendanceHeatmap = () => {
  const { attendanceRecords } = useAttendance();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedDate, setSelectedDate] = useState<AttendanceDay | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  useEffect(() => {
    if (!svgRef.current || !attendanceRecords.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Process data for heatmap
    const currentDate = new Date();
    const startDate = viewMode === 'month' 
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      : new Date(currentDate.getFullYear(), 0, 1);

    const endDate = viewMode === 'month'
      ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      : new Date(currentDate.getFullYear(), 11, 31);

    const attendanceMap = new Map(
      attendanceRecords.map(record => [record.date, record])
    );

    const data: AttendanceDay[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const record = attendanceMap.get(dateStr);
      
      data.push({
        date: dateStr,
        value: record ? (record.total_hours || 0) : 0,
        status: record?.status || 'absent',
        hours: record?.total_hours || 0
      });
      
      current.setDate(current.getDate() + 1);
    }

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
      .range([0, width]);

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, d => d.value) || 8]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate cell dimensions
    const cellSize = Math.min(width / data.length, 30);
    const cellHeight = viewMode === 'month' ? 25 : 15;

    // Create cells
    const cells = g.selectAll('.cell')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d, i) => i * cellSize)
      .attr('y', 0)
      .attr('width', cellSize - 1)
      .attr('height', cellHeight)
      .attr('fill', d => d.value === 0 ? '#f3f4f6' : colorScale(d.value))
      .attr('rx', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        setSelectedDate(d);
        d3.select(this)
          .transition()
          .duration(150)
          .attr('stroke', 'hsl(var(--primary))')
          .attr('stroke-width', 2);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('stroke', 'none');
      });

    // Add date labels for month view
    if (viewMode === 'month') {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      g.selectAll('.day-label')
        .data(data.filter((d, i) => i < 7))
        .enter()
        .append('text')
        .attr('class', 'day-label')
        .attr('x', (d, i) => i * cellSize + cellSize / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', 'hsl(var(--muted-foreground))')
        .text((d, i) => weekdays[new Date(d.date).getDay()]);
    }

    // Add month labels for year view
    if (viewMode === 'year') {
      const months = d3.timeMonths(startDate, endDate);
      g.selectAll('.month-label')
        .data(months)
        .enter()
        .append('text')
        .attr('class', 'month-label')
        .attr('x', d => xScale(d))
        .attr('y', cellHeight + 15)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', 'hsl(var(--muted-foreground))')
        .text(d => d3.timeFormat('%b')(d));
    }

  }, [attendanceRecords, viewMode]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600';
      case 'late': return 'text-yellow-600';
      case 'absent': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Attendance Heatmap</CardTitle>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded text-xs ${
              viewMode === 'month' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`px-3 py-1 rounded text-xs ${
              viewMode === 'year' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Year
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg 
            ref={svgRef} 
            width="100%" 
            height="240"
            className="overflow-visible"
          />
          
          {selectedDate && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-2 right-2 bg-popover border rounded-lg p-3 shadow-lg z-10"
            >
              <div className="text-sm">
                <div className="font-medium">
                  {new Date(selectedDate.date).toLocaleDateString()}
                </div>
                <div className={`capitalize ${getStatusColor(selectedDate.status)}`}>
                  {selectedDate.status}
                </div>
                {selectedDate.hours > 0 && (
                  <div className="text-muted-foreground">
                    {selectedDate.hours}h worked
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5].map(level => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: level === 0 ? '#f3f4f6' : d3.interpolateBlues(level / 5)
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceHeatmap;