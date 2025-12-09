import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { calculateAttendanceStats, getAttendanceStatusColor, AttendanceStatus } from '@/data/attendance';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarOff,
  TrendingUp,
} from 'lucide-react';

export default function Attendance() {
  const { user, canAssign, getVisibleEmployees, getEmployeeById } = useAuth();
  const { getMyAttendance, getAttendanceByEmployee, markAttendance, getTodayAttendance, attendance } = useData();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  if (!user) return null;

  const myAttendance = getMyAttendance();
  const todayAttendance = getTodayAttendance();
  const myStats = calculateAttendanceStats(myAttendance);
  const canViewOthers = canAssign();
  const subordinates = getVisibleEmployees().filter((e) => e.id !== user.id);

  const handleMarkAttendance = (status: AttendanceStatus) => {
    markAttendance(status);
    toast.success(`Attendance marked as ${status}`);
  };

  const getSubordinateAttendance = () => {
    if (!selectedEmployee) return [];
    return getAttendanceByEmployee(selectedEmployee);
  };

  const subordinateAttendance = getSubordinateAttendance();
  const subordinateStats = calculateAttendanceStats(subordinateAttendance);

  return (
    <DashboardLayout title="Attendance">
      <div className="space-y-6 animate-fade-in">
        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Attendance - {new Date().toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAttendance ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge
                    className={cn(
                      'text-lg py-2 px-6',
                      getAttendanceStatusColor(todayAttendance.status)
                    )}
                  >
                    {todayAttendance.status}
                  </Badge>
                  {todayAttendance.checkIn && (
                    <p className="text-muted-foreground">
                      Check-in: {todayAttendance.checkIn}
                    </p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  You can update your attendance status
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleMarkAttendance('Present')}
                  className="bg-success hover:bg-success/90"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Present
                </Button>
                <Button
                  onClick={() => handleMarkAttendance('Half Day')}
                  variant="outline"
                  className="border-warning text-warning hover:bg-warning/10"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Half Day
                </Button>
                <Button
                  onClick={() => handleMarkAttendance('Leave')}
                  variant="outline"
                  className="border-info text-info hover:bg-info/10"
                >
                  <CalendarOff className="w-4 h-4 mr-2" />
                  On Leave
                </Button>
                <Button
                  onClick={() => handleMarkAttendance('Absent')}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Absent
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{myStats.present}</p>
                  <p className="text-sm text-muted-foreground">Present Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{myStats.absent}</p>
                  <p className="text-sm text-muted-foreground">Absent Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-info/10">
                  <CalendarOff className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{myStats.leave}</p>
                  <p className="text-sm text-muted-foreground">Leave Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{myStats.presentPercentage}%</p>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Attendance Rate</span>
                  <span className="text-sm font-medium text-foreground">{myStats.presentPercentage}%</span>
                </div>
                <Progress value={myStats.presentPercentage} className="h-3" />
              </div>
              <div className="grid grid-cols-4 gap-4 text-center pt-4">
                <div>
                  <p className="text-lg font-bold text-success">{myStats.present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-warning">{myStats.halfDay}</p>
                  <p className="text-xs text-muted-foreground">Half Day</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-info">{myStats.leave}</p>
                  <p className="text-xs text-muted-foreground">Leave</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-destructive">{myStats.absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="my-attendance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="my-attendance">My Attendance</TabsTrigger>
            {canViewOthers && subordinates.length > 0 && (
              <TabsTrigger value="team-attendance">Team Attendance</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="my-attendance">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myAttendance
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 30)
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="text-foreground">
                              {new Date(record.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge className={cn('text-xs', getAttendanceStatusColor(record.status))}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {record.checkIn || '-'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {record.checkOut || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {canViewOthers && subordinates.length > 0 && (
            <TabsContent value="team-attendance">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <CardTitle>Team Attendance Records</CardTitle>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger className="w-full sm:w-64">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {subordinates.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name} - {emp.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedEmployee ? (
                    <div className="space-y-6">
                      {/* Employee Stats */}
                      <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                        <div className="text-center">
                          <p className="text-lg font-bold text-success">{subordinateStats.present}</p>
                          <p className="text-xs text-muted-foreground">Present</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-destructive">{subordinateStats.absent}</p>
                          <p className="text-xs text-muted-foreground">Absent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-info">{subordinateStats.leave}</p>
                          <p className="text-xs text-muted-foreground">Leave</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{subordinateStats.presentPercentage}%</p>
                          <p className="text-xs text-muted-foreground">Rate</p>
                        </div>
                      </div>

                      {/* Attendance Table */}
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Check In</TableHead>
                              <TableHead>Check Out</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subordinateAttendance
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .slice(0, 30)
                              .map((record) => (
                                <TableRow key={record.id}>
                                  <TableCell className="text-foreground">
                                    {new Date(record.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={cn('text-xs', getAttendanceStatusColor(record.status))}>
                                      {record.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {record.checkIn || '-'}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {record.checkOut || '-'}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Select an employee to view their attendance records
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
