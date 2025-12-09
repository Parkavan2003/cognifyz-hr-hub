export type MessageType = "direct" | "feedback" | "instruction";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  type: MessageType;
  subject: string;
  content: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
}

export const initialMessages: Message[] = [
  {
    id: "m1",
    senderId: "1",
    receiverId: "2",
    type: "instruction",
    subject: "Q4 Priorities",
    content: "Please ensure all department heads submit their Q4 reports by December 15th. This is critical for our annual review.",
    read: true,
    createdAt: "2024-11-01T09:00:00",
  },
  {
    id: "m2",
    senderId: "2",
    receiverId: "3",
    type: "direct",
    subject: "Product Launch Timeline",
    content: "Can we discuss the product launch timeline? I have some concerns about the current schedule.",
    read: true,
    createdAt: "2024-11-05T14:30:00",
  },
  {
    id: "m3",
    senderId: "2",
    receiverId: "4",
    type: "direct",
    subject: "Operations Budget",
    content: "Please prepare the operations budget proposal for Q1 2025. We need to present it at the board meeting.",
    read: false,
    createdAt: "2024-11-10T11:00:00",
  },
  {
    id: "m4",
    senderId: "3",
    receiverId: "5",
    type: "feedback",
    subject: "Great work on the architecture review",
    content: "Excellent job on the system architecture review. Your recommendations have been approved for implementation.",
    taskId: "t4",
    read: true,
    createdAt: "2024-11-15T16:00:00",
  },
  {
    id: "m5",
    senderId: "5",
    receiverId: "7",
    type: "instruction",
    subject: "Team Meeting Tomorrow",
    content: "Please prepare a status update on all ongoing projects for tomorrow's team meeting at 10 AM.",
    read: true,
    createdAt: "2024-11-20T17:30:00",
  },
  {
    id: "m6",
    senderId: "7",
    receiverId: "9",
    type: "direct",
    subject: "Sprint Planning",
    content: "Let's sync up before the sprint planning session. I want to discuss the priority of some backlog items.",
    read: false,
    createdAt: "2024-11-25T09:15:00",
  },
  {
    id: "m7",
    senderId: "9",
    receiverId: "13",
    type: "feedback",
    subject: "API Documentation Feedback",
    content: "Good progress on the API documentation. Please add more examples for the authentication endpoints.",
    taskId: "t12",
    read: true,
    createdAt: "2024-11-28T14:00:00",
  },
  {
    id: "m8",
    senderId: "13",
    receiverId: "17",
    type: "instruction",
    subject: "Code Review Required",
    content: "Please review the PR for the authentication feature. We need to merge it by end of week.",
    taskId: "t16",
    read: false,
    createdAt: "2024-11-30T10:00:00",
  },
  {
    id: "m9",
    senderId: "6",
    receiverId: "10",
    type: "direct",
    subject: "Marketing Campaign Update",
    content: "How is the holiday campaign progressing? I need to update the CEO on our marketing initiatives.",
    read: true,
    createdAt: "2024-11-22T11:30:00",
  },
  {
    id: "m10",
    senderId: "10",
    receiverId: "18",
    type: "feedback",
    subject: "Content Calendar Approved",
    content: "Great job on the December content calendar! Everything has been approved. Let's start execution.",
    taskId: "t17",
    read: true,
    createdAt: "2024-11-27T15:45:00",
  },
];

export function getMessageTypeColor(type: MessageType): string {
  const colors: Record<MessageType, string> = {
    direct: "bg-primary/10 text-primary",
    feedback: "bg-success/10 text-success",
    instruction: "bg-warning/10 text-warning",
  };
  return colors[type];
}

export function getMessageTypeLabel(type: MessageType): string {
  const labels: Record<MessageType, string> = {
    direct: "Direct Message",
    feedback: "Feedback",
    instruction: "Instruction",
  };
  return labels[type];
}
