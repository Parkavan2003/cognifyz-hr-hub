import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStatusColor, getPriorityColor, TaskStatus, TaskPriority } from '@/data/tasks';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Plus,
  ListTodo,
  Clock,
  TrendingUp,
  CheckCircle2,
  Search,
} from 'lucide-react';

export default function Tasks() {
  const { user, canAssign, getVisibleEmployees, getEmployeeById } = useAuth();
  const { tasks, getMyTasks, getAssignedTasks, addTask, updateTaskStatus } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');

  if (!user) return null;

  const myTasks = getMyTasks();
  const assignedByMe = getAssignedTasks();
  const canAssignTasks = canAssign();
  const subordinates = getVisibleEmployees().filter((e) => e.id !== user.id);

  const filterTasks = (taskList: typeof tasks) => {
    return taskList.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const handleCreateTask = () => {
    if (!title || !description || !assignedTo || !dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    addTask({
      title,
      description,
      assignedTo,
      assignedBy: user.id,
      status: 'Pending',
      priority,
      dueDate,
    });

    toast.success('Task created successfully');
    setIsDialogOpen(false);
    resetForm();
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    toast.success(`Task status updated to ${newStatus}`);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setPriority('Medium');
    setDueDate('');
  };

  const TaskTable = ({ taskList, showAssignee = true, showActions = true }: {
    taskList: typeof tasks;
    showAssignee?: boolean;
    showActions?: boolean;
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          {showAssignee && <TableHead>Assigned To</TableHead>}
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filterTasks(taskList).map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <div>
                <p className="font-medium text-foreground">{task.title}</p>
                <p className="text-sm text-muted-foreground truncate max-w-xs">
                  {task.description}
                </p>
              </div>
            </TableCell>
            {showAssignee && (
              <TableCell className="text-foreground">
                {getEmployeeById(task.assignedTo)?.name || 'Unknown'}
              </TableCell>
            )}
            <TableCell>
              <Badge className={cn('text-xs', getPriorityColor(task.priority))}>
                {task.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={cn('text-xs', getStatusColor(task.status))}>
                {task.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{task.dueDate}</TableCell>
            {showActions && task.assignedTo === user.id && (
              <TableCell>
                <Select
                  value={task.status}
                  onValueChange={(value) => handleStatusChange(task.id, value as TaskStatus)}
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            )}
            {showActions && task.assignedTo !== user.id && (
              <TableCell className="text-muted-foreground text-sm">-</TableCell>
            )}
          </TableRow>
        ))}
        {filterTasks(taskList).length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No tasks found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const pendingCount = myTasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = myTasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = myTasks.filter((t) => t.status === 'Completed').length;

  return (
    <DashboardLayout title="Task Management">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <ListTodo className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{myTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-info/10">
                  <TrendingUp className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{inProgressCount}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {canAssignTasks && subordinates.length > 0 && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Assign Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Assign New Task</DialogTitle>
                      <DialogDescription>
                        Create and assign a task to your team members
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Task title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Task description"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignee">Assign To</Label>
                        <Select value={assignedTo} onValueChange={setAssignedTo}>
                          <SelectTrigger>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTask}>Create Task</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Tabs */}
        <Tabs defaultValue="my-tasks" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="my-tasks">My Tasks ({myTasks.length})</TabsTrigger>
            {canAssignTasks && (
              <TabsTrigger value="assigned">Assigned by Me ({assignedByMe.length})</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="my-tasks">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <TaskTable taskList={myTasks} showAssignee={false} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {canAssignTasks && (
            <TabsContent value="assigned">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <TaskTable taskList={assignedByMe} showActions={false} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
