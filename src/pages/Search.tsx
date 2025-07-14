import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PromptCard } from '@/components/features/PromptCard';
import { 
  Search as SearchIcon, 
  Filter, 
  X, 
  SlidersHorizontal,
  Calendar,
  Star,
  Zap,
  Users,
  Hash
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SearchFilters {
  categories: string[];
  aiModels: string[];
  tokenUsage: string[];
  minRating: number;
  dateRange: string;
  sortBy: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  content: string;
  rating: number;
  reviewCount: number;
  saves: number;
  copies: number;
  comments: number;
  likes: number;
  whoFor: string[];
  aiModels: string[];
  tokenUsage: 'Low' | 'Medium' | 'High';
  author: {
    name: string;
    avatar?: string;
  };
  isBookmarked: boolean;
  isLiked: boolean;
  imageUrl?: string;
}

const CATEGORIES = ['Developers', 'Designers', 'Marketers', 'Writers', 'Entrepreneurs'];
const AI_MODELS = ['GPT-4', 'GPT-3.5', 'Claude', 'Gemini', 'Llama'];
const TOKEN_USAGE_OPTIONS = ['Low', 'Medium', 'High'];
const DATE_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  
  const [filters, setFilters] = useState<SearchFilters>({
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    aiModels: searchParams.get('aiModels')?.split(',').filter(Boolean) || [],
    tokenUsage: searchParams.get('tokenUsage')?.split(',').filter(Boolean) || [],
    minRating: parseInt(searchParams.get('minRating') || '0'),
    dateRange: searchParams.get('dateRange') || 'all',
    sortBy: searchParams.get('sortBy') || 'relevance',
  });

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, type, filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual search with Supabase
      // For now, mock some results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Advanced Code Review Assistant',
          description: 'A comprehensive prompt for conducting thorough code reviews with security considerations',
          content: 'Review the following code for...',
          rating: 4.8,
          reviewCount: 45,
          saves: 123,
          copies: 456,
          comments: 12,
          likes: 89,
          whoFor: ['Developers'],
          aiModels: ['GPT-4', 'Claude'],
          tokenUsage: 'High',
          author: { name: 'CodeMaster' },
          isBookmarked: false,
          isLiked: false,
        },
        // Add more mock results...
      ];

      // Filter results based on current filters
      const filteredResults = mockResults.filter(result => {
        const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                           result.description.toLowerCase().includes(query.toLowerCase());
        
        const matchesCategories = filters.categories.length === 0 || 
                                filters.categories.some(cat => result.whoFor.includes(cat));
        
        const matchesAiModels = filters.aiModels.length === 0 ||
                              filters.aiModels.some(model => result.aiModels.includes(model));
        
        const matchesTokenUsage = filters.tokenUsage.length === 0 ||
                                filters.tokenUsage.includes(result.tokenUsage);
        
        const matchesRating = result.rating >= filters.minRating;

        return matchesQuery && matchesCategories && matchesAiModels && 
               matchesTokenUsage && matchesRating;
      });

      setResults(filteredResults);
      setTotalResults(filteredResults.length);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search prompts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSearchParams = (newFilters: Partial<SearchFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      
      const params = new URLSearchParams(searchParams);
    
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (typeof value === 'string' && value) {
        params.set(key, value);
      } else if (typeof value === 'number' && value > 0) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      categories: [],
      aiModels: [],
      tokenUsage: [],
      minRating: 0,
      dateRange: 'all',
      sortBy: 'relevance',
    };
    setFilters(clearedFilters);
    setSearchParams({ q: query, type });
  };

  const removeFilter = (filterType: string, value: string) => {
    const updatedFilters = { ...filters };
    if (Array.isArray(updatedFilters[filterType as keyof SearchFilters])) {
      updatedFilters[filterType as keyof SearchFilters] = 
        (updatedFilters[filterType as keyof SearchFilters] as string[])
          .filter(item => item !== value);
    }
    updateSearchParams(updatedFilters);
  };

  const activeFiltersCount = useMemo(() => {
    return filters.categories.length + 
           filters.aiModels.length + 
           filters.tokenUsage.length + 
           (filters.minRating > 0 ? 1 : 0) +
           (filters.dateRange !== 'all' ? 1 : 0);
  }, [filters]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Search Results</h1>
              <p className="text-muted-foreground">
                {loading ? 'Searching...' : `${totalResults} results for "${query}"`}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters Pills */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFilter('categories', category)}
                  />
                </Badge>
              ))}
              {filters.aiModels.map(model => (
                <Badge key={model} variant="outline" className="flex items-center gap-1">
                  {model}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFilter('aiModels', model)}
                  />
                </Badge>
              ))}
              {filters.tokenUsage.map(usage => (
                <Badge key={usage} variant="outline" className="flex items-center gap-1">
                  {usage} Usage
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFilter('tokenUsage', usage)}
                  />
                </Badge>
              ))}
              {filters.minRating > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {filters.minRating}+ Stars
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateSearchParams({ minRating: 0 })}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear all
                    </Button>
                  </div>

                  <Separator />

                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Categories
                    </h4>
                    <div className="space-y-2">
                      {CATEGORIES.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={(checked) => {
                              const newCategories = checked
                                ? [...filters.categories, category]
                                : filters.categories.filter(c => c !== category);
                              updateSearchParams({ categories: newCategories });
                            }}
                          />
                          <label 
                            htmlFor={`category-${category}`} 
                            className="text-sm cursor-pointer"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* AI Models */}
                  <div>
                    <h4 className="font-medium mb-3">AI Models</h4>
                    <div className="space-y-2">
                      {AI_MODELS.map(model => (
                        <div key={model} className="flex items-center space-x-2">
                          <Checkbox
                            id={`model-${model}`}
                            checked={filters.aiModels.includes(model)}
                            onCheckedChange={(checked) => {
                              const newModels = checked
                                ? [...filters.aiModels, model]
                                : filters.aiModels.filter(m => m !== model);
                              updateSearchParams({ aiModels: newModels });
                            }}
                          />
                          <label 
                            htmlFor={`model-${model}`} 
                            className="text-sm cursor-pointer"
                          >
                            {model}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Token Usage */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Token Usage
                    </h4>
                    <div className="space-y-2">
                      {TOKEN_USAGE_OPTIONS.map(usage => (
                        <div key={usage} className="flex items-center space-x-2">
                          <Checkbox
                            id={`usage-${usage}`}
                            checked={filters.tokenUsage.includes(usage)}
                            onCheckedChange={(checked) => {
                              const newUsage = checked
                                ? [...filters.tokenUsage, usage]
                                : filters.tokenUsage.filter(u => u !== usage);
                              updateSearchParams({ tokenUsage: newUsage });
                            }}
                          />
                          <label 
                            htmlFor={`usage-${usage}`} 
                            className="text-sm cursor-pointer"
                          >
                            {usage}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Minimum Rating */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Minimum Rating
                    </h4>
                    <div className="space-y-3">
                      <Slider
                        value={[filters.minRating]}
                        onValueChange={([value]) => updateSearchParams({ minRating: value })}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Any</span>
                        <span>{filters.minRating}+ stars</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Date Range */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date Range
                    </h4>
                    <Select 
                      value={filters.dateRange} 
                      onValueChange={(value) => updateSearchParams({ dateRange: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DATE_RANGES.map(range => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                {totalResults} results
              </p>
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => updateSearchParams({ sortBy: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="h-64 animate-pulse bg-muted" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((result) => (
                  <PromptCard 
                    key={result.id} 
                    prompt={result}
                    onCardClick={(id) => navigate(`/prompts/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Suggestions:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="outline" size="sm">coding</Button>
                    <Button variant="outline" size="sm">writing</Button>
                    <Button variant="outline" size="sm">marketing</Button>
                    <Button variant="outline" size="sm">design</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}