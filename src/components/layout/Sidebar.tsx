import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import cognifyzLogo from '@/assets/cognifyz-logo.png';
import {
  LayoutDashboard,
  Users,
  ListTodo,
  Calendar,
  DollarSign,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/attendance', label: 'Attendance', icon: Calendar },
  { path: '/salary', label: 'Salary', icon: DollarSign },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const { getUnreadCount } = useData();
  const location = useLocation();
  const unreadCount = getUnreadCount();

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar/95 backdrop-blur-xl text-sidebar-foreground flex flex-col transition-all duration-300 sticky top-0 border-r border-sidebar-border/50',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border px-4">
        <img
          src={cognifyzLogo}
          alt="Cognifyz"
          className={cn('h-10 transition-all', collapsed ? 'w-10' : 'w-auto')}
        />
        {!collapsed && (
          <span className="ml-2 font-semibold text-lg text-sidebar-foreground">Cognifyz</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const showBadge = item.path === '/messages' && unreadCount > 0;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive && 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 font-medium">{item.label}</span>
                  )}
                  {!collapsed && showBadge && (
                    <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                  {collapsed && showBadge && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-2 mb-2 p-2 rounded-lg hover:bg-sidebar-accent transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
            'hover:bg-destructive/10 text-sidebar-muted hover:text-destructive'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
