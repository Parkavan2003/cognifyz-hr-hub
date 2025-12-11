import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRoleColor, ROLE_HIERARCHY } from '@/data/employees';
import { getStatusColor, getPriorityColor } from '@/data/tasks';
import { calculateAttendanceStats, getAttendanceStatusColor } from '@/data/attendance';
import { cn } from '@/lib/utils';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import {
  User,
  ListTodo,
  Calendar,
  DollarSign,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, getVisibleEmployees, canAssign } = useAuth();
  const { getMyTasks, getMyAttendance, getMyMessages, getTodayAttendance } = useData();

  if (!user) return null;

  const myTasks = getMyTasks();
  const myAttendance = getMyAttendance();
  const myMessages = getMyMessages();
  const todayAttendance = getTodayAttendance();
  const visibleEmployees = getVisibleEmployees();
  const attendanceStats = calculateAttendanceStats(myAttendance);

  const pendingTasks = myTasks.filter(t => t.status === 'Pending').length;
  const inProgressTasks = myTasks.filter(t => t.status === 'In Progress').length;
  const completedTasks = myTasks.filter(t => t.status === 'Completed').length;
  const unreadMessages = myMessages.filter(m => !m.read).length;

  const isManager = canAssign();
  const teamSize = visibleEmployees.length - 1;

  const stats = [
    {
      label: 'My Tasks',
      value: myTasks.length,
      icon: ListTodo,
      color: 'text-primary',
      bg: 'bg-primary/10',
      cardBg: 'bg-gradient-to-br from-primary/10 to-primary/5',
      link: '/tasks',
    },
    {
      label: 'Team Members',
      value: teamSize,
      icon: Users,
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
      cardBg: 'bg-gradient-to-br from-chart-2/10 to-chart-2/5',
      link: '/employees',
    },
    {
      label: 'Attendance',
      value: `${attendanceStats.presentPercentage}%`,
      icon: Calendar,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
      cardBg: 'bg-gradient-to-br from-chart-3/10 to-chart-3/5',
      link: '/attendance',
    },
    {
      label: 'Messages',
      value: unreadMessages,
      subLabel: 'unread',
      icon: MessageSquare,
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
      cardBg: 'bg-gradient-to-br from-chart-4/10 to-chart-4/5',
      link: '/messages',
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="glass-card-strong p-4 sm:p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-chart-5 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Welcome back, {user.name.split(' ')[0]}!
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
                  Here's what's happening with your work today.
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn('text-xs sm:text-sm py-1 sm:py-1.5 px-3 sm:px-4 w-fit', getRoleColor(user.role))}
            >
              {user.role}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.link}>
                <div className="stat-card">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className={cn('p-2.5 sm:p-3 rounded-xl w-fit', stat.bg)}>
                      <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', stat.color)} />
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{stat.subLabel || stat.label}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Charts Section - Only for managers and above */}
        {(isManager || ROLE_HIERARCHY[user.role] <= 6) && (
          <DashboardCharts
            taskData={{ pending: pendingTasks, inProgress: inProgressTasks, completed: completedTasks }}
            attendanceData={{ present: attendanceStats.present, absent: attendanceStats.absent, percentage: attendanceStats.presentPercentage }}
            teamSize={teamSize}
            isManager={isManager}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* My Profile Card */}
          <Card className="glass-card card-hover lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/20 to-chart-4/20 flex items-center justify-center">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.employee.email}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium text-foreground">{user.employee.department}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="outline" className={cn('text-[10px] sm:text-xs', getRoleColor(user.role))}>
                    {user.role}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium text-foreground">
                    {new Date(user.employee.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Summary */}
          <Card className="glass-card card-hover lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <ListTodo className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  My Tasks
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your current task status</CardDescription>
              </div>
              <Link to="/tasks">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-3 sm:p-4 rounded-xl bg-warning/10 glass-card">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-warning mx-auto mb-1.5 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{pendingTasks}</p>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-info/10 glass-card">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-info mx-auto mb-1.5 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{inProgressTasks}</p>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">In Progress</p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-success/10 glass-card">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success mx-auto mb-1.5 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{completedTasks}</p>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Completed</p>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="space-y-2 sm:space-y-3">
                {myTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:p-3 rounded-lg bg-muted/30 glass-card gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <Badge className={cn('text-[10px] sm:text-xs', getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                      <Badge className={cn('text-[10px] sm:text-xs', getStatusColor(task.status))}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {myTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-4 text-sm">No tasks assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Today's Attendance */}
          <Card className="glass-card card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Today's Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayAttendance ? (
                <div className="text-center py-3 sm:py-4">
                  <Badge
                    className={cn(
                      'text-sm sm:text-lg py-1.5 sm:py-2 px-4 sm:px-6',
                      getAttendanceStatusColor(todayAttendance.status)
                    )}
                  >
                    {todayAttendance.status}
                  </Badge>
                  {todayAttendance.checkIn && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
                      Checked in at {todayAttendance.checkIn}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-3 sm:py-4">
                  <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-warning mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm text-muted-foreground">Not marked yet</p>
                  <Link to="/attendance">
                    <Button className="mt-2 sm:mt-3" size="sm">
                      Mark Attendance
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Salary Overview */}
          <Card className="glass-card card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Salary Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-3 sm:py-4">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">
                  ₹{user.employee.salary.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Monthly Salary</p>
              </div>
              <Link to="/salary">
                <Button variant="outline" className="w-full mt-3 sm:mt-4 text-xs sm:text-sm">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="glass-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Messages
              </CardTitle>
              {unreadMessages > 0 && (
                <Badge variant="destructive" className="text-[10px] sm:text-xs">{unreadMessages} new</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {myMessages.slice(0, 3).map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'p-2.5 sm:p-3 rounded-lg border',
                      msg.read ? 'bg-muted/20 border-border/50' : 'bg-primary/5 border-primary/20'
                    )}
                  >
                    <p className="font-medium text-foreground text-xs sm:text-sm truncate">{msg.subject}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {myMessages.length === 0 && (
                  <p className="text-center text-muted-foreground py-4 text-sm">No messages</p>
                )}
              </div>
              <Link to="/messages">
                <Button variant="outline" className="w-full mt-3 sm:mt-4 text-xs sm:text-sm">
                  View All Messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
