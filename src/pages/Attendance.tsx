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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { calculateAttendanceStats, getAttendanceStatusColor, AttendanceStatus } from '@/data/attendance';
import { getRoleColor } from '@/data/employees';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarOff,
  TrendingUp,
  LogIn,
  LogOut,
  Users,
  Pencil,
  Building2,
  User,
} from 'lucide-react';

export default function Attendance() {
  const { user, canAssign, getVisibleEmployees, getEmployeeById } = useAuth();
  const { 
    getMyAttendance, 
    getAttendanceByEmployee, 
    markAttendance, 
    getTodayAttendance, 
    checkIn, 
    checkOut,
    updateAttendance,
    getTodayAttendanceByEmployee 
  } = useData();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [editingRecord, setEditingRecord] = useState<{ employeeId: string; date: string } | null>(null);

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

  const handleCheckIn = () => {
    checkIn();
    toast.success('Checked in successfully!');
  };

  const handleCheckOut = () => {
    checkOut();
    toast.success('Checked out successfully!');
  };

  const handleUpdateAttendance = (employeeId: string, date: string, status: AttendanceStatus) => {
    updateAttendance(employeeId, date, status);
    setEditingRecord(null);
    toast.success('Attendance updated successfully!');
  };

  const getSubordinateAttendance = () => {
    if (!selectedEmployee) return [];
    return getAttendanceByEmployee(selectedEmployee);
  };

  const subordinateAttendance = getSubordinateAttendance();
  const subordinateStats = calculateAttendanceStats(subordinateAttendance);

  const getReportingManagerName = (managerId: string | null) => {
    if (!managerId) return 'None';
    const manager = getEmployeeById(managerId);
    return manager?.name || 'Unknown';
  };

  return (
    <DashboardLayout title="Attendance">
      <div className="space-y-6 animate-fade-in">
        {/* Today's Attendance with Check-in/out */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Attendance - {new Date().toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAttendance ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Badge
                      className={cn(
                        'text-lg py-2 px-6',
                        getAttendanceStatusColor(todayAttendance.status)
                      )}
                    >
                      {todayAttendance.status}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {todayAttendance.checkIn && (
                        <span className="flex items-center gap-1">
                          <LogIn className="w-4 h-4" />
                          In: {todayAttendance.checkIn}
                        </span>
                      )}
                      {todayAttendance.checkOut && (
                        <span className="flex items-center gap-1">
                          <LogOut className="w-4 h-4" />
                          Out: {todayAttendance.checkOut}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!todayAttendance.checkIn && (todayAttendance.status === 'Present' || todayAttendance.status === 'Half Day') && (
                      <Button onClick={handleCheckIn} size="sm" className="bg-success hover:bg-success/90">
                        <LogIn className="w-4 h-4 mr-2" />
                        Check In
                      </Button>
                    )}
                    {todayAttendance.checkIn && !todayAttendance.checkOut && (todayAttendance.status === 'Present' || todayAttendance.status === 'Half Day') && (
                      <Button onClick={handleCheckOut} size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                        <LogOut className="w-4 h-4 mr-2" />
                        Check Out
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can update your attendance status using the buttons below
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleMarkAttendance('Present')}
                    size="sm"
                    variant={todayAttendance.status === 'Present' ? 'default' : 'outline'}
                    className={todayAttendance.status === 'Present' ? 'bg-success hover:bg-success/90' : ''}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Present
                  </Button>
                  <Button
                    onClick={() => handleMarkAttendance('Half Day')}
                    size="sm"
                    variant={todayAttendance.status === 'Half Day' ? 'default' : 'outline'}
                    className={todayAttendance.status === 'Half Day' ? 'bg-warning hover:bg-warning/90' : ''}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Half Day
                  </Button>
                  <Button
                    onClick={() => handleMarkAttendance('Leave')}
                    size="sm"
                    variant={todayAttendance.status === 'Leave' ? 'default' : 'outline'}
                    className={todayAttendance.status === 'Leave' ? 'bg-info hover:bg-info/90' : ''}
                  >
                    <CalendarOff className="w-4 h-4 mr-2" />
                    Leave
                  </Button>
                  <Button
                    onClick={() => handleMarkAttendance('Absent')}
                    size="sm"
                    variant={todayAttendance.status === 'Absent' ? 'default' : 'outline'}
                    className={todayAttendance.status === 'Absent' ? 'bg-destructive hover:bg-destructive/90' : ''}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Absent
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleCheckIn} className="bg-success hover:bg-success/90">
                    <LogIn className="w-4 h-4 mr-2" />
                    Check In
                  </Button>
                  <Button
                    onClick={() => handleMarkAttendance('Present')}
                    variant="outline"
                    className="border-success text-success hover:bg-success/10"
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
              <>
                <TabsTrigger value="team-overview">Team Overview</TabsTrigger>
                <TabsTrigger value="team-attendance">Team Attendance</TabsTrigger>
              </>
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
            <>
              {/* Team Overview Tab - Shows subordinates with details */}
              <TabsContent value="team-overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Your Subordinates ({subordinates.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Reporting Manager</TableHead>
                            <TableHead>Today's Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subordinates.map((emp) => {
                            const empTodayAttendance = getTodayAttendanceByEmployee(emp.id);
                            return (
                              <TableRow key={emp.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium text-foreground">{emp.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={cn('text-xs', getRoleColor(emp.role))}>
                                    {emp.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Building2 className="w-4 h-4" />
                                    {emp.department}
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {getReportingManagerName(emp.reportingManagerId)}
                                </TableCell>
                                <TableCell>
                                  {empTodayAttendance ? (
                                    <Badge className={cn('text-xs', getAttendanceStatusColor(empTodayAttendance.status))}>
                                      {empTodayAttendance.status}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">Not Marked</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setEditingRecord({ employeeId: emp.id, date: new Date().toISOString().split('T')[0] })}
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Update Attendance - {emp.name}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4 pt-4">
                                        <p className="text-sm text-muted-foreground">
                                          Update today's attendance for {emp.name}
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                          <Button
                                            onClick={() => handleUpdateAttendance(emp.id, new Date().toISOString().split('T')[0], 'Present')}
                                            className="bg-success hover:bg-success/90"
                                          >
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Present
                                          </Button>
                                          <Button
                                            onClick={() => handleUpdateAttendance(emp.id, new Date().toISOString().split('T')[0], 'Half Day')}
                                            className="bg-warning hover:bg-warning/90"
                                          >
                                            <Clock className="w-4 h-4 mr-2" />
                                            Half Day
                                          </Button>
                                          <Button
                                            onClick={() => handleUpdateAttendance(emp.id, new Date().toISOString().split('T')[0], 'Leave')}
                                            className="bg-info hover:bg-info/90"
                                          >
                                            <CalendarOff className="w-4 h-4 mr-2" />
                                            Leave
                                          </Button>
                                          <Button
                                            onClick={() => handleUpdateAttendance(emp.id, new Date().toISOString().split('T')[0], 'Absent')}
                                            className="bg-destructive hover:bg-destructive/90"
                                          >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Absent
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Team Attendance Tab - Shows attendance records */}
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
                        {/* Selected Employee Info */}
                        {(() => {
                          const emp = getEmployeeById(selectedEmployee);
                          if (!emp) return null;
                          return (
                            <div className="p-4 bg-muted rounded-lg">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Name</p>
                                  <p className="font-medium text-foreground">{emp.name}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Role</p>
                                  <Badge className={cn('text-xs mt-1', getRoleColor(emp.role))}>
                                    {emp.role}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Department</p>
                                  <p className="font-medium text-foreground">{emp.department}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Reporting Manager</p>
                                  <p className="font-medium text-foreground">{getReportingManagerName(emp.reportingManagerId)}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

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

                        {/* Attendance Table with Update Option */}
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Check In</TableHead>
                                <TableHead>Check Out</TableHead>
                                <TableHead>Actions</TableHead>
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
                                    <TableCell>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Pencil className="w-4 h-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Update Attendance</DialogTitle>
                                          </DialogHeader>
                                          <div className="space-y-4 pt-4">
                                            <p className="text-sm text-muted-foreground">
                                              Update attendance for {new Date(record.date).toLocaleDateString()}
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                              <Button
                                                onClick={() => handleUpdateAttendance(record.employeeId, record.date, 'Present')}
                                                className="bg-success hover:bg-success/90"
                                              >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Present
                                              </Button>
                                              <Button
                                                onClick={() => handleUpdateAttendance(record.employeeId, record.date, 'Half Day')}
                                                className="bg-warning hover:bg-warning/90"
                                              >
                                                <Clock className="w-4 h-4 mr-2" />
                                                Half Day
                                              </Button>
                                              <Button
                                                onClick={() => handleUpdateAttendance(record.employeeId, record.date, 'Leave')}
                                                className="bg-info hover:bg-info/90"
                                              >
                                                <CalendarOff className="w-4 h-4 mr-2" />
                                                Leave
                                              </Button>
                                              <Button
                                                onClick={() => handleUpdateAttendance(record.employeeId, record.date, 'Absent')}
                                                className="bg-destructive hover:bg-destructive/90"
                                              >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Absent
                                              </Button>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
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
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
