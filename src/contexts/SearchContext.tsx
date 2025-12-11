import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  type: 'employee' | 'task' | 'message' | 'page';
  title: string;
  subtitle?: string;
  link: string;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  search: (query: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  navigateToResult: (result: SearchResult) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const pages: SearchResult[] = [
  { type: 'page', title: 'Dashboard', link: '/dashboard' },
  { type: 'page', title: 'Employees', subtitle: 'View all employees', link: '/employees' },
  { type: 'page', title: 'Tasks', subtitle: 'Manage tasks', link: '/tasks' },
  { type: 'page', title: 'Attendance', subtitle: 'Track attendance', link: '/attendance' },
  { type: 'page', title: 'Salary', subtitle: 'View salary details', link: '/salary' },
  { type: 'page', title: 'Messages', subtitle: 'View messages', link: '/messages' },
];

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filteredPages = pages.filter(
      page => 
        page.title.toLowerCase().includes(lowerQuery) ||
        page.subtitle?.toLowerCase().includes(lowerQuery)
    );

    setResults(filteredPages);
  }, []);

  const navigateToResult = useCallback((result: SearchResult) => {
    navigate(result.link);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, [navigate]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results, search, isOpen, setIsOpen, navigateToResult }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
