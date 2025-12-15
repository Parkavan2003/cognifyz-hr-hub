import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, PieChartIcon, BarChart3, Activity } from 'lucide-react';

interface DashboardChartsProps {
  taskData: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  attendanceData: {
    present: number;
    absent: number;
    percentage: number;
  };
  teamSize: number;
  isManager: boolean;
  isFounder?: boolean;
}

const chartConfig = {
  pending: { label: 'Pending', color: 'hsl(var(--warning))' },
  inProgress: { label: 'In Progress', color: 'hsl(var(--info))' },
  completed: { label: 'Completed', color: 'hsl(var(--success))' },
  present: { label: 'Present', color: 'hsl(var(--success))' },
  absent: { label: 'Absent', color: 'hsl(var(--destructive))' },
};

export function DashboardCharts({ taskData, attendanceData, teamSize, isManager, isFounder = false }: DashboardChartsProps) {
  const taskChartData = [
    { name: 'Pending', value: taskData.pending, fill: 'hsl(var(--warning))' },
    { name: 'In Progress', value: taskData.inProgress, fill: 'hsl(var(--info))' },
    { name: 'Completed', value: taskData.completed, fill: 'hsl(var(--success))' },
  ];

  const attendanceChartData = [
    { name: 'Present', value: attendanceData.present, fill: 'hsl(var(--success))' },
    { name: 'Absent', value: attendanceData.absent, fill: 'hsl(var(--destructive))' },
  ];

  // Weekly performance mock data
  const weeklyData = [
    { day: 'Mon', tasks: 3, attendance: 100 },
    { day: 'Tue', tasks: 5, attendance: 100 },
    { day: 'Wed', tasks: 2, attendance: 100 },
    { day: 'Thu', tasks: 4, attendance: 0 },
    { day: 'Fri', tasks: 6, attendance: 100 },
    { day: 'Sat', tasks: 1, attendance: 100 },
    { day: 'Sun', tasks: 0, attendance: 0 },
  ];

  // Department distribution for managers
  const departmentData = [
    { name: 'Engineering', value: Math.ceil(teamSize * 0.4), fill: 'hsl(var(--primary))' },
    { name: 'Product', value: Math.ceil(teamSize * 0.2), fill: 'hsl(var(--chart-4))' },
    { name: 'Marketing', value: Math.ceil(teamSize * 0.15), fill: 'hsl(var(--chart-3))' },
    { name: 'Sales', value: Math.ceil(teamSize * 0.15), fill: 'hsl(var(--chart-2))' },
    { name: 'Others', value: Math.max(1, teamSize - Math.ceil(teamSize * 0.9)), fill: 'hsl(var(--chart-5))' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {/* Task Distribution Pie Chart - Hidden for Founder */}
      {!isFounder && (
        <Card className="glass-card card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[180px] sm:h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-3">
              {taskChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-xs sm:text-sm text-muted-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Performance Line Chart */}
      <Card className="glass-card card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[180px] sm:h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorTasks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Attendance Bar Chart */}
      <Card className="glass-card card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Attendance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[180px] sm:h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {attendanceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="text-center mt-3">
            <span className="text-xl sm:text-2xl font-bold text-foreground">{attendanceData.percentage}%</span>
            <span className="text-xs sm:text-sm text-muted-foreground ml-2">Attendance Rate</span>
          </div>
        </CardContent>
      </Card>

      {/* Team Distribution (for managers) */}
      {isManager && teamSize > 0 && (
        <Card className="glass-card card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Team Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[180px] sm:h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${value}`}
                    labelLine={false}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3">
              {departmentData.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
