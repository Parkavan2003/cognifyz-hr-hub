import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Button } from '@/components/ui/button';
import { getRoleColor } from '@/data/employees';
import { cn } from '@/lib/utils';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  Eye,
} from 'lucide-react';

export default function Salary() {
  const { user, canAssign, getVisibleEmployees } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  if (!user) return null;

  const canViewOthers = canAssign();
  const subordinates = getVisibleEmployees().filter((e) => e.id !== user.id);

  const getEmployeeDetails = (id: string) => {
    return getVisibleEmployees().find((e) => e.id === id);
  };

  const selectedEmployeeData = selectedEmployee ? getEmployeeDetails(selectedEmployee) : null;

  // Salary breakdown calculation
  const calculateBreakdown = (baseSalary: number) => {
    const basic = baseSalary * 0.5;
    const hra = baseSalary * 0.25;
    const specialAllowance = baseSalary * 0.15;
    const pf = basic * 0.12;
    const tax = baseSalary > 100000 ? baseSalary * 0.1 : baseSalary * 0.05;
    const netSalary = baseSalary - pf - tax;

    return {
      basic,
      hra,
      specialAllowance,
      pf,
      tax,
      netSalary,
      gross: baseSalary,
    };
  };

  const myBreakdown = calculateBreakdown(user.employee.salary);

  const SalaryBreakdown = ({ salary, name }: { salary: number; name: string }) => {
    const breakdown = calculateBreakdown(salary);
    return (
      <div className="space-y-4">
        <div className="text-center pb-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-3xl font-bold text-primary mt-2">
            ₹{breakdown.gross.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Gross Monthly Salary</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-foreground text-sm">Earnings</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Basic Salary</span>
              <span className="text-foreground">₹{breakdown.basic.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">House Rent Allowance</span>
              <span className="text-foreground">₹{breakdown.hra.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Special Allowance</span>
              <span className="text-foreground">₹{breakdown.specialAllowance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="font-medium text-foreground text-sm">Deductions</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Provident Fund (12%)</span>
              <span className="text-destructive">-₹{breakdown.pf.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Income Tax</span>
              <span className="text-destructive">-₹{breakdown.tax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Net Salary</span>
            <span className="font-bold text-success text-lg">
              ₹{breakdown.netSalary.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="Salary Overview">
      <div className="space-y-6 animate-fade-in">
        {/* My Salary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{myBreakdown.gross.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Gross Salary</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{myBreakdown.netSalary.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Net Salary</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-info/10">
                  <CreditCard className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{myBreakdown.pf.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">PF Contribution</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <FileText className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{myBreakdown.tax.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Tax Deduction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Salary Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                My Salary Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalaryBreakdown salary={user.employee.salary} name={user.name} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['December 2024', 'November 2024', 'October 2024', 'September 2024'].map(
                  (month, index) => (
                    <div
                      key={month}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{month}</p>
                        <p className="text-sm text-muted-foreground">
                          {index === 0 ? 'Pending' : 'Paid'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ₹{myBreakdown.netSalary.toLocaleString()}
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            index === 0
                              ? 'bg-warning/10 text-warning'
                              : 'bg-success/10 text-success'
                          }
                        >
                          {index === 0 ? 'Pending' : 'Paid'}
                        </Badge>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Salary (for managers) */}
        {canViewOthers && subordinates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Team Salary Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subordinates.map((emp) => {
                      const breakdown = calculateBreakdown(emp.salary);
                      return (
                        <TableRow key={emp.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                {emp.name.charAt(0)}
                              </div>
                              <span className="font-medium text-foreground">{emp.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn('text-xs', getRoleColor(emp.role))}
                            >
                              {emp.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{emp.department}</TableCell>
                          <TableCell className="text-foreground">
                            ₹{breakdown.gross.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-success font-medium">
                            ₹{breakdown.netSalary.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Salary Details</DialogTitle>
                                </DialogHeader>
                                <SalaryBreakdown salary={emp.salary} name={emp.name} />
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
        )}
      </div>
    </DashboardLayout>
  );
}
