import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, initialTasks, TaskStatus } from '@/data/tasks';
import { Message, initialMessages, MessageType } from '@/data/messages';
import { AttendanceRecord, initialAttendance, AttendanceStatus } from '@/data/attendance';
import { useAuth } from './AuthContext';

interface DataContextType {
  tasks: Task[];
  messages: Message[];
  attendance: AttendanceRecord[];
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  getMyTasks: () => Task[];
  getAssignedTasks: () => Task[];
  getTasksByEmployee: (employeeId: string) => Task[];
  
  // Message operations
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void;
  markMessageRead: (messageId: string) => void;
  getMyMessages: () => Message[];
  getSentMessages: () => Message[];
  getUnreadCount: () => number;
  
  // Attendance operations
  markAttendance: (status: AttendanceStatus) => void;
  checkIn: () => void;
  checkOut: () => void;
  updateAttendance: (employeeId: string, date: string, status: AttendanceStatus) => void;
  getMyAttendance: () => AttendanceRecord[];
  getAttendanceByEmployee: (employeeId: string) => AttendanceRecord[];
  getTodayAttendance: () => AttendanceRecord | undefined;
  getTodayAttendanceByEmployee: (employeeId: string) => AttendanceRecord | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedTasks = localStorage.getItem('cognifyz_tasks');
    const storedMessages = localStorage.getItem('cognifyz_messages');
    const storedAttendance = localStorage.getItem('cognifyz_attendance');

    setTasks(storedTasks ? JSON.parse(storedTasks) : initialTasks);
    setMessages(storedMessages ? JSON.parse(storedMessages) : initialMessages);
    setAttendance(storedAttendance ? JSON.parse(storedAttendance) : initialAttendance);

    if (!storedTasks) localStorage.setItem('cognifyz_tasks', JSON.stringify(initialTasks));
    if (!storedMessages) localStorage.setItem('cognifyz_messages', JSON.stringify(initialMessages));
    if (!storedAttendance) localStorage.setItem('cognifyz_attendance', JSON.stringify(initialAttendance));
  }, []);

  // Task operations
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      comments: [],
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem('cognifyz_tasks', JSON.stringify(updated));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const updated = tasks.map(t =>
      t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString().split('T')[0] } : t
    );
    setTasks(updated);
    localStorage.setItem('cognifyz_tasks', JSON.stringify(updated));
  };

  const getMyTasks = () => {
    if (!user) return [];
    return tasks.filter(t => t.assignedTo === user.id);
  };

  const getAssignedTasks = () => {
    if (!user) return [];
    return tasks.filter(t => t.assignedBy === user.id);
  };

  const getTasksByEmployee = (employeeId: string) => {
    return tasks.filter(t => t.assignedTo === employeeId);
  };

  // Message operations
  const addMessage = (messageData: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `m${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem('cognifyz_messages', JSON.stringify(updated));
  };

  const markMessageRead = (messageId: string) => {
    const updated = messages.map(m =>
      m.id === messageId ? { ...m, read: true } : m
    );
    setMessages(updated);
    localStorage.setItem('cognifyz_messages', JSON.stringify(updated));
  };

  const getMyMessages = () => {
    if (!user) return [];
    return messages.filter(m => m.receiverId === user.id);
  };

  const getSentMessages = () => {
    if (!user) return [];
    return messages.filter(m => m.senderId === user.id);
  };

  const getUnreadCount = () => {
    if (!user) return 0;
    return messages.filter(m => m.receiverId === user.id && !m.read).length;
  };

  // Attendance operations
  const markAttendance = (status: AttendanceStatus) => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = attendance.findIndex(
      a => a.employeeId === user.id && a.date === today
    );

    const record: AttendanceRecord = {
      id: `att-${user.id}-${today}`,
      employeeId: user.id,
      date: today,
      status,
      checkIn: status === "Present" || status === "Half Day" ? new Date().toTimeString().slice(0, 5) : undefined,
      checkOut: undefined,
    };

    let updated: AttendanceRecord[];
    if (existingIndex >= 0) {
      updated = attendance.map((a, i) => i === existingIndex ? record : a);
    } else {
      updated = [...attendance, record];
    }

    setAttendance(updated);
    localStorage.setItem('cognifyz_attendance', JSON.stringify(updated));
  };

  const checkIn = () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().slice(0, 5);
    const existingIndex = attendance.findIndex(
      a => a.employeeId === user.id && a.date === today
    );

    const record: AttendanceRecord = {
      id: `att-${user.id}-${today}`,
      employeeId: user.id,
      date: today,
      status: "Present",
      checkIn: currentTime,
      checkOut: undefined,
    };

    let updated: AttendanceRecord[];
    if (existingIndex >= 0) {
      updated = attendance.map((a, i) => i === existingIndex ? { ...a, checkIn: currentTime, status: "Present" as AttendanceStatus } : a);
    } else {
      updated = [...attendance, record];
    }

    setAttendance(updated);
    localStorage.setItem('cognifyz_attendance', JSON.stringify(updated));
  };

  const checkOut = () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().slice(0, 5);
    
    const updated = attendance.map(a => 
      a.employeeId === user.id && a.date === today 
        ? { ...a, checkOut: currentTime } 
        : a
    );

    setAttendance(updated);
    localStorage.setItem('cognifyz_attendance', JSON.stringify(updated));
  };

  const updateAttendance = (employeeId: string, date: string, status: AttendanceStatus) => {
    const existingIndex = attendance.findIndex(
      a => a.employeeId === employeeId && a.date === date
    );

    if (existingIndex >= 0) {
      const updated = attendance.map((a, i) => 
        i === existingIndex 
          ? { ...a, status, checkIn: status === "Present" || status === "Half Day" ? a.checkIn || "09:00" : undefined, checkOut: status === "Present" ? a.checkOut || "18:00" : status === "Half Day" ? "13:00" : undefined } 
          : a
      );
      setAttendance(updated);
      localStorage.setItem('cognifyz_attendance', JSON.stringify(updated));
    } else {
      const record: AttendanceRecord = {
        id: `att-${employeeId}-${date}`,
        employeeId,
        date,
        status,
        checkIn: status === "Present" || status === "Half Day" ? "09:00" : undefined,
        checkOut: status === "Present" ? "18:00" : status === "Half Day" ? "13:00" : undefined,
      };
      const updated = [...attendance, record];
      setAttendance(updated);
      localStorage.setItem('cognifyz_attendance', JSON.stringify(updated));
    }
  };

  const getMyAttendance = () => {
    if (!user) return [];
    return attendance.filter(a => a.employeeId === user.id);
  };

  const getAttendanceByEmployee = (employeeId: string) => {
    return attendance.filter(a => a.employeeId === employeeId);
  };

  const getTodayAttendance = () => {
    if (!user) return undefined;
    const today = new Date().toISOString().split('T')[0];
    return attendance.find(a => a.employeeId === user.id && a.date === today);
  };

  const getTodayAttendanceByEmployee = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.find(a => a.employeeId === employeeId && a.date === today);
  };

  return (
    <DataContext.Provider value={{
      tasks,
      messages,
      attendance,
      addTask,
      updateTaskStatus,
      getMyTasks,
      getAssignedTasks,
      getTasksByEmployee,
      addMessage,
      markMessageRead,
      getMyMessages,
      getSentMessages,
      getUnreadCount,
      markAttendance,
      checkIn,
      checkOut,
      updateAttendance,
      getMyAttendance,
      getAttendanceByEmployee,
      getTodayAttendance,
      getTodayAttendanceByEmployee,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
