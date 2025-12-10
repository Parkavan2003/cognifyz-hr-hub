import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Bell, Search, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRoleColor } from '@/data/employees';
import { cn } from '@/lib/utils';

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user } = useAuth();
  const { getUnreadCount } = useData();
  const unreadCount = getUnreadCount();

  return (
    <header className="h-14 sm:h-16 bg-card/70 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div>
        <h1 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-border/50">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground truncate max-w-[120px]">{user.name}</p>
              <Badge
                variant="outline"
                className={cn('text-xs', getRoleColor(user.role))}
              >
                {user.role}
              </Badge>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/20 to-chart-4/20 flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
