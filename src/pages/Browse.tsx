import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PromptCard } from '@/components/features/PromptCard';
import { FilterSidebar } from '@/components/features/FilterSidebar';
import { MobileFilters } from '@/components/features/MobileFilters';
import { EmptyState } from '@/components/features/EmptyState';
import { 
  Search, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import type { PromptCardData } from '@/types/prompt';

const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'saves', label: 'Most Saved' },
  { value: 'copies', label: 'Most Copied' }
];

export default function Browse() {
  const [prompts, setPrompts] = useState<PromptCardData[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<PromptCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    categories: [],
    models: [],
    tokenUsage: [],
    minRating: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setIsLoading(true);
      
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select(`
          *,
          prompt_tags (
            tags (
              name,
              type
            )
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompts:', error);
        return;
      }

      // Transform data to match expected format
      const transformedPrompts: PromptCardData[] = prompts?.map((prompt, index) => ({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        whoFor: prompt.prompt_tags?.filter(pt => pt.tags.type === 'who_for').map(pt => pt.tags.name) || [],
        aiModels: prompt.prompt_tags?.filter(pt => pt.tags.type === 'ai_model').map(pt => pt.tags.name) || [],
        tokenUsage: prompt.token_usage as 'low' | 'medium' | 'high',
        rating: 4.5 + (Math.random() * 0.5), // Randomize between 4.5-5.0
        reviewCount: 50 + Math.floor(Math.random() * 200),
        emoji: prompt.emoji || '🎨',
        background_color: prompt.background_color || 'gradient-blue',
        saves: Math.floor((prompt.copy_count || 0) / 2),
        copies: prompt.copy_count || 0,
        comments: 0, // Will add when comments are implemented
        likes: prompt.view_count || 0,
        author: { name: "Anonymous", avatar: "" }, // Will add when user profiles are linked
        isBookmarked: false,
        isLiked: false
      })) || [];

      setPrompts(transformedPrompts);
      setFilteredPrompts(transformedPrompts);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...prompts];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.whoFor.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(prompt =>
        prompt.whoFor.some(tag => filters.categories.includes(tag))
      );
    }

    if (filters.models.length > 0) {
      filtered = filtered.filter(prompt =>
        prompt.aiModels.some(model => filters.models.includes(model))
      );
    }

    if (filters.tokenUsage.length > 0) {
      filtered = filtered.filter(prompt =>
        filters.tokenUsage.includes(prompt.tokenUsage)
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(prompt => (prompt.rating || 0) >= filters.minRating);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        case 'saves':
          return b.saves - a.saves;
        case 'copies':
          return b.copies - a.copies;
        default: // popularity
          return (b.saves + b.copies + b.likes) - (a.saves + a.copies + a.likes);
      }
    });

    setFilteredPrompts(filtered);
  }, [prompts, searchQuery, filters, sortBy]);

  const handleCardClick = (id: string) => {
    // TODO: Navigate to prompt detail page
    console.log('Navigate to prompt:', id);
  };

  const handleCopy = (id: string) => {
    toast({
      title: "Copied to clipboard",
      description: "Prompt has been copied to your clipboard.",
    });
  };

  const handleBookmark = (id: string) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === id 
        ? { ...prompt, isBookmarked: !prompt.isBookmarked }
        : prompt
    ));
    
    const prompt = prompts.find(p => p.id === id);
    toast({
      title: prompt?.isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: prompt?.isBookmarked ? "Prompt removed from your collection." : "Prompt saved to your collection.",
    });
  };

  const handleLike = (id: string) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === id 
        ? { 
            ...prompt, 
            isLiked: !prompt.isLiked,
            likes: prompt.isLiked ? prompt.likes - 1 : prompt.likes + 1
          }
        : prompt
    ));
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      models: [],
      tokenUsage: [],
      minRating: 0
    });
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + filters.models.length + filters.tokenUsage.length + (filters.minRating > 0 ? 1 : 0);
  };

  // Skeleton loader for cards
  const SkeletonCard = () => (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
            {/* Title and Search */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Browse Prompts</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {filteredPrompts.length} prompts found
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="relative lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass border-border/50 focus:border-primary/50 h-9 sm:h-10 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between lg:justify-end space-x-2 sm:space-x-3">
              {/* Mobile Filters */}
              <div className="lg:hidden">
                <MobileFilters 
                  onFilterChange={handleFilterChange}
                  activeFiltersCount={getActiveFiltersCount()}
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 sm:w-40 glass border-border/50 h-9 sm:h-10 text-xs sm:text-sm">
                  <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden md:flex border border-border/50 rounded-lg p-0.5 sm:p-1 glass">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="w-7 h-7 sm:w-8 sm:h-8 p-0"
                >
                  <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="w-7 h-7 sm:w-8 sm:h-8 p-0"
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xs sm:text-sm text-muted-foreground shrink-0">Active filters:</span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
                {filters.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {filters.models.map((model) => (
                  <Badge key={model} variant="outline" className="text-xs">
                    {model}
                  </Badge>
                ))}
                 {filters.tokenUsage.map((usage) => (
                   <Badge key={usage} variant="outline" className="text-xs">
                     {usage.charAt(0).toUpperCase() + usage.slice(1)} tokens
                   </Badge>
                 ))}
                {filters.minRating > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {filters.minRating}+ stars
                  </Badge>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs h-auto p-1 sm:ml-2 self-start sm:self-auto"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-28 xl:top-32">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredPrompts.length === 0 ? (
              <EmptyState 
                type="no-results"
                searchQuery={searchQuery}
                onReset={clearAllFilters}
              />
            ) : (
              <motion.div 
                className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: 0.1,
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onCardClick={handleCardClick}
                  />
                ))}
              </motion.div>
            )}

            {/* Load More Button */}
            {!isLoading && filteredPrompts.length > 0 && (
              <motion.div 
                className="text-center mt-8 sm:mt-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="glass border-border/50 hover:bg-primary/5 text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3"
                >
                  Load More Prompts
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}