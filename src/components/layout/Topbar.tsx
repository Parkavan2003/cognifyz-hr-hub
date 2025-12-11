import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useSearch } from '@/contexts/SearchContext';
import { Bell, Search, User, LayoutDashboard, Users, ListTodo, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRoleColor } from '@/data/employees';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  title: string;
}

const searchPages = [
  { title: 'Dashboard', icon: LayoutDashboard, link: '/dashboard' },
  { title: 'Employees', icon: Users, link: '/employees' },
  { title: 'Tasks', icon: ListTodo, link: '/tasks' },
  { title: 'Attendance', icon: Calendar, link: '/attendance' },
  { title: 'Salary', icon: DollarSign, link: '/salary' },
  { title: 'Messages', icon: MessageSquare, link: '/messages' },
];

export function Topbar({ title }: TopbarProps) {
  const { user } = useAuth();
  const { getUnreadCount } = useData();
  const unreadCount = getUnreadCount();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredPages = searchQuery.trim()
    ? searchPages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (link: string) => {
    navigate(link);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="h-14 sm:h-16 bg-card/70 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div>
        <h1 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div ref={searchRef} className="hidden md:block relative">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground"
            />
          </div>
          
          {/* Search Results Dropdown */}
          {isSearchFocused && (searchQuery.trim() || filteredPages.length > 0) && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.link}
                      onClick={() => handleNavigate(page.link)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{page.title}</span>
                    </button>
                  );
                })
              ) : searchQuery.trim() ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
              ) : null}
            </div>
          )}
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
