import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRoleColor } from '@/data/employees';
import { getStatusColor, getPriorityColor } from '@/data/tasks';
import { calculateAttendanceStats, getAttendanceStatusColor } from '@/data/attendance';
import { cn } from '@/lib/utils';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, getVisibleEmployees } = useAuth();
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

  const stats = [
    {
      label: 'My Tasks',
      value: myTasks.length,
      icon: ListTodo,
      color: 'text-primary',
      bg: 'bg-primary/10',
      link: '/tasks',
    },
    {
      label: 'Team Members',
      value: visibleEmployees.length - 1,
      icon: Users,
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
      link: '/employees',
    },
    {
      label: 'Attendance',
      value: `${attendanceStats.presentPercentage}%`,
      icon: Calendar,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
      link: '/attendance',
    },
    {
      label: 'Messages',
      value: unreadMessages,
      subLabel: 'unread',
      icon: MessageSquare,
      color: 'text-chart-5',
      bg: 'bg-chart-5/10',
      link: '/messages',
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back, {user.name.split(' ')[0]}!
            </h2>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your work today.
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn('text-sm py-1.5 px-4', getRoleColor(user.role))}
          >
            {user.role}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.link}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className={cn('p-3 rounded-xl', stat.bg)}>
                        <Icon className={cn('w-6 h-6', stat.color)} />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.subLabel || stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.employee.email}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium text-foreground">{user.employee.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="outline" className={cn('text-xs', getRoleColor(user.role))}>
                    {user.role}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium text-foreground">
                    {new Date(user.employee.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Summary */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-primary" />
                  My Tasks
                </CardTitle>
                <CardDescription>Your current task status</CardDescription>
              </div>
              <Link to="/tasks">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-warning/10">
                  <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{pendingTasks}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-info/10">
                  <TrendingUp className="w-6 h-6 text-info mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{inProgressTasks}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-success/10">
                  <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{completedTasks}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="space-y-3">
                {myTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{task.title}</p>
                      <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn('text-xs', getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                      <Badge className={cn('text-xs', getStatusColor(task.status))}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {myTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No tasks assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Today's Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayAttendance ? (
                <div className="text-center py-4">
                  <Badge
                    className={cn(
                      'text-lg py-2 px-6',
                      getAttendanceStatusColor(todayAttendance.status)
                    )}
                  >
                    {todayAttendance.status}
                  </Badge>
                  {todayAttendance.checkIn && (
                    <p className="text-sm text-muted-foreground mt-3">
                      Checked in at {todayAttendance.checkIn}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="w-12 h-12 text-warning mx-auto mb-3" />
                  <p className="text-muted-foreground">Not marked yet</p>
                  <Link to="/attendance">
                    <Button className="mt-3" size="sm">
                      Mark Attendance
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Salary Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Salary Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-foreground">
                  ₹{user.employee.salary.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Monthly Salary</p>
              </div>
              <Link to="/salary">
                <Button variant="outline" className="w-full mt-4">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Messages
              </CardTitle>
              {unreadMessages > 0 && (
                <Badge variant="destructive">{unreadMessages} new</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myMessages.slice(0, 3).map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'p-3 rounded-lg border',
                      msg.read ? 'bg-muted/30 border-border' : 'bg-primary/5 border-primary/20'
                    )}
                  >
                    <p className="font-medium text-foreground text-sm truncate">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {myMessages.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No messages</p>
                )}
              </div>
              <Link to="/messages">
                <Button variant="outline" className="w-full mt-4">
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
