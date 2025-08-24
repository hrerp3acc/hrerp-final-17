
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, User, Calendar, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'employee' | 'leave' | 'document' | 'timesheet';
  url: string;
}

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { toast } = useToast();

  // Search across multiple data sources
  const performSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    try {
      const searchResults: SearchResult[] = [];

      // Search employees
      const { data: employees } = await supabase
        .from('employees')
        .select('id, first_name, last_name, position')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,position.ilike.%${searchQuery}%`)
        .limit(3);

      if (employees) {
        employees.forEach(emp => {
          searchResults.push({
            id: emp.id,
            title: `${emp.first_name} ${emp.last_name}`,
            subtitle: emp.position || 'Employee',
            type: 'employee',
            url: `/employees/${emp.id}`
          });
        });
      }

      // Search leave applications  
      const { data: leaves } = await supabase
        .from('leave_applications')
        .select(`
          id, 
          leave_type, 
          status,
          employee:employees!leave_applications_employee_id_fkey (first_name, last_name)
        `)
        .eq('status', 'pending')
        .limit(2);

      if (leaves) {
        leaves.forEach(leave => {
          if (leave.employee) {
            searchResults.push({
              id: leave.id,
              title: `${leave.leave_type} Leave`,
              subtitle: `${leave.employee.first_name} ${leave.employee.last_name} - ${leave.status}`,
              type: 'leave',
              url: '/leave/management'
            });
          }
        });
      }

      // Search performance goals
      const { data: goals } = await supabase
        .from('performance_goals')
        .select(`
          id, 
          title, 
          status,
          employee:employees!performance_goals_employee_id_fkey (first_name, last_name)
        `)
        .ilike('title', `%${searchQuery}%`)
        .limit(2);

      if (goals) {
        goals.forEach(goal => {
          if (goal.employee) {
            searchResults.push({
              id: goal.id,
              title: goal.title,
              subtitle: `${goal.employee.first_name} ${goal.employee.last_name} - ${goal.status}`,
              type: 'document',
              url: '/performance'
            });
          }
        });
      }

      setResults(searchResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform search",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'employee':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'leave':
        return <Calendar className="w-4 h-4 text-green-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'timesheet':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Search className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search employees, leaves, documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                    index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center space-x-3">
                    {getResultIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isOpen && results.length === 0 && query.length > 1 && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-4 text-center text-gray-500">
            No results found for "{query}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;
