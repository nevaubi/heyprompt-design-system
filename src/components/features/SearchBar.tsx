import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Clock, 
  Hash, 
  User, 
  X,
  TrendingUp
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchSuggestion {
  id: string;
  type: 'prompt' | 'user' | 'tag' | 'recent';
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface SearchBarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTypeSelector?: boolean;
}

export function SearchBar({ className = '', size = 'md', showTypeSelector = true }: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length > 0) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions(getRecentSuggestions());
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async (searchQuery: string) => {
    // TODO: Implement actual API call
    // For now, mock some suggestions
    const mockSuggestions: SearchSuggestion[] = [
      {
        id: '1',
        type: 'prompt' as const,
        title: 'Code Review Assistant',
        subtitle: 'Advanced prompt for reviewing code',
        icon: <Hash className="w-4 h-4" />
      },
      {
        id: '2',
        type: 'prompt' as const,
        title: 'Content Writing Helper',
        subtitle: 'Generate engaging blog posts',
        icon: <Hash className="w-4 h-4" />
      },
      {
        id: '3',
        type: 'user' as const,
        title: '@codemaster',
        subtitle: '12 prompts • 4.8★ rating',
        icon: <User className="w-4 h-4" />
      },
      {
        id: '4',
        type: 'tag' as const,
        title: 'developers',
        subtitle: '234 prompts',
        icon: <Hash className="w-4 h-4" />
      },
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(mockSuggestions);
  };

  const getRecentSuggestions = (): SearchSuggestion[] => {
    return recentSearches.slice(0, 5).map((search, index) => ({
      id: `recent-${index}`,
      type: 'recent',
      title: search,
      icon: <Clock className="w-4 h-4 text-muted-foreground" />
    }));
  };

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)]
      .slice(0, 10); // Keep only last 10 searches
    
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
    setSuggestions([]);
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    saveRecentSearch(finalQuery);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(finalQuery)}&type=${searchType}`);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'recent' || suggestion.type === 'prompt') {
      handleSearch(suggestion.title);
    } else if (suggestion.type === 'user') {
      navigate(`/u/${suggestion.title.replace('@', '')}`);
    } else if (suggestion.type === 'tag') {
      navigate(`/search?q=${encodeURIComponent(suggestion.title)}&type=tag`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 text-sm';
      case 'lg':
        return 'h-12 text-lg';
      default:
        return 'h-10';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Search Type Selector */}
        {showTypeSelector && (
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="rounded-l-md border border-r-0 border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All</option>
            <option value="prompts">Prompts</option>
            <option value="users">Users</option>
            <option value="tags">Tags</option>
          </select>
        )}

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search prompts, users, or tags..."
            className={`pl-10 ${getSizeClasses()} ${
              showTypeSelector ? 'rounded-l-none' : ''
            } ${showSuggestions ? 'rounded-b-none' : ''}`}
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={() => handleSearch()}
          className={`${getSizeClasses()} rounded-l-none px-6`}
          disabled={!query.trim()}
        >
          Search
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSuggestions(false)}
          />
          
          {/* Suggestions */}
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 bg-background border border-t-0 border-border rounded-b-lg shadow-lg max-h-80 overflow-y-auto"
          >
            {suggestions.length > 0 ? (
              <div className="py-2">
                {/* Recent Searches Header */}
                {query.length === 0 && recentSearches.length > 0 && (
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Recent Searches
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="h-6 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                )}

                {/* Suggestions List */}
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    className={`w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 transition-colors ${
                      index === selectedIndex ? 'bg-accent' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.icon}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {suggestion.title}
                      </div>
                      {suggestion.subtitle && (
                        <div className="text-xs text-muted-foreground truncate">
                          {suggestion.subtitle}
                        </div>
                      )}
                    </div>
                    {suggestion.type === 'recent' && (
                      <X
                        className="w-4 h-4 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = recentSearches.filter(s => s !== suggestion.title);
                          setRecentSearches(updated);
                          localStorage.setItem('recentSearches', JSON.stringify(updated));
                          setSuggestions(getRecentSuggestions());
                        }}
                      />
                    )}
                  </button>
                ))}

                {/* Trending Searches */}
                {query.length === 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="px-4 py-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Trending
                      </span>
                    </div>
                    {['AI coding assistant', 'Content marketing', 'UI/UX design'].map((trend, index) => (
                      <button
                        key={trend}
                        className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 transition-colors"
                        onClick={() => handleSearch(trend)}
                      >
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{trend}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            ) : query.length > 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No suggestions found</p>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}