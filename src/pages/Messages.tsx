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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMessageTypeColor, getMessageTypeLabel, MessageType } from '@/data/messages';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  MessageSquare,
  Send,
  Inbox,
  SendHorizontal,
  Mail,
  MailOpen,
  Plus,
} from 'lucide-react';

export default function Messages() {
  const { user, canMessage, getVisibleEmployees, getEmployeeById } = useAuth();
  const { getMyMessages, getSentMessages, addMessage, markMessageRead, getUnreadCount } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  // Form state
  const [receiverId, setReceiverId] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('direct');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  if (!user) return null;

  const myMessages = getMyMessages();
  const sentMessages = getSentMessages();
  const unreadCount = getUnreadCount();
  const visibleEmployees = getVisibleEmployees().filter((e) => e.id !== user.id);

  // Filter employees user can message
  const messageableEmployees = visibleEmployees.filter((emp) => canMessage(emp.role));

  const handleSendMessage = () => {
    if (!receiverId || !subject || !content) {
      toast.error('Please fill all required fields');
      return;
    }

    addMessage({
      senderId: user.id,
      receiverId,
      type: messageType,
      subject,
      content,
    });

    toast.success('Message sent successfully');
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setReceiverId('');
    setMessageType('direct');
    setSubject('');
    setContent('');
  };

  const handleMessageClick = (messageId: string) => {
    setSelectedMessage(messageId);
    const msg = myMessages.find((m) => m.id === messageId);
    if (msg && !msg.read) {
      markMessageRead(messageId);
    }
  };

  const getSelectedMessage = () => {
    return [...myMessages, ...sentMessages].find((m) => m.id === selectedMessage);
  };

  const selectedMsg = getSelectedMessage();

  return (
    <DashboardLayout title="Messages">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Inbox className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{myMessages.length}</p>
                  <p className="text-sm text-muted-foreground">Inbox</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Mail className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <SendHorizontal className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{sentMessages.length}</p>
                  <p className="text-sm text-muted-foreground">Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compose Button */}
        {messageableEmployees.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Compose Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription>Send a message to your team members</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="receiver">To</Label>
                  <Select value={receiverId} onValueChange={setReceiverId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {messageableEmployees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} - {emp.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Message Type</Label>
                  <Select
                    value={messageType}
                    onValueChange={(v) => setMessageType(v as MessageType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct Message</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="instruction">Instruction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Message subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your message here..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="inbox" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="inbox" className="flex-1">
                  Inbox ({myMessages.length})
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex-1">
                  Sent ({sentMessages.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inbox" className="m-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                      {myMessages.length > 0 ? (
                        myMessages
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                          )
                          .map((msg) => (
                            <button
                              key={msg.id}
                              onClick={() => handleMessageClick(msg.id)}
                              className={cn(
                                'w-full text-left p-4 hover:bg-muted/50 transition-colors',
                                selectedMessage === msg.id && 'bg-primary/5',
                                !msg.read && 'bg-primary/10'
                              )}
                            >
                              <div className="flex items-start gap-3">
                                {msg.read ? (
                                  <MailOpen className="w-5 h-5 text-muted-foreground mt-0.5" />
                                ) : (
                                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-foreground truncate">
                                      {getEmployeeById(msg.senderId)?.name || 'Unknown'}
                                    </span>
                                    <Badge
                                      className={cn('text-xs', getMessageTypeColor(msg.type))}
                                    >
                                      {getMessageTypeLabel(msg.type)}
                                    </Badge>
                                  </div>
                                  <p
                                    className={cn(
                                      'text-sm truncate',
                                      msg.read ? 'text-muted-foreground' : 'text-foreground font-medium'
                                    )}
                                  >
                                    {msg.subject}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No messages</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sent" className="m-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                      {sentMessages.length > 0 ? (
                        sentMessages
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                          )
                          .map((msg) => (
                            <button
                              key={msg.id}
                              onClick={() => setSelectedMessage(msg.id)}
                              className={cn(
                                'w-full text-left p-4 hover:bg-muted/50 transition-colors',
                                selectedMessage === msg.id && 'bg-primary/5'
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <SendHorizontal className="w-5 h-5 text-success mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-muted-foreground">To:</span>
                                    <span className="font-medium text-foreground truncate">
                                      {getEmployeeById(msg.receiverId)?.name || 'Unknown'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {msg.subject}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No sent messages</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              {selectedMsg ? (
                <>
                  <CardHeader className="border-b border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedMsg.subject}</CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <span>
                            {selectedMsg.senderId === user.id ? 'To' : 'From'}:{' '}
                            <span className="text-foreground font-medium">
                              {getEmployeeById(
                                selectedMsg.senderId === user.id
                                  ? selectedMsg.receiverId
                                  : selectedMsg.senderId
                              )?.name || 'Unknown'}
                            </span>
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(selectedMsg.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Badge className={cn(getMessageTypeColor(selectedMsg.type))}>
                        {getMessageTypeLabel(selectedMsg.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground whitespace-pre-wrap">{selectedMsg.content}</p>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Select a message to view</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
