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

// Mock data for prompts
const mockPrompts = [
  {
    id: '1',
    title: 'Marketing Email Generator',
    description: 'Create compelling marketing emails that convert. Includes subject line suggestions and A/B testing variations for maximum engagement.',
    whoFor: ['Marketers', 'Small Business', 'Agencies'],
    aiModels: ['GPT-4', 'Claude'],
    tokenUsage: 'Medium' as const,
    rating: 4.8,
    reviewCount: 234,
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop',
    saves: 1234,
    copies: 3456,
    comments: 89,
    likes: 567,
    author: { name: 'Sarah Chen', avatar: '' },
    isBookmarked: false,
    isLiked: false
  },
  {
    id: '2',
    title: 'Code Review Assistant',
    description: 'Get detailed code reviews with suggestions for improvements, best practices, and security considerations for any programming language.',
    whoFor: ['Developers', 'Team Leads', 'Students'],
    aiModels: ['GPT-4', 'Claude', 'Gemini'],
    tokenUsage: 'High' as const,
    rating: 4.9,
    reviewCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=200&fit=crop',
    saves: 892,
    copies: 2103,
    comments: 67,
    likes: 445,
    author: { name: 'Alex Rodriguez', avatar: '' },
    isBookmarked: true,
    isLiked: false
  },
  {
    id: '3',
    title: 'Blog Post Outliner',
    description: 'Generate detailed blog post outlines with SEO optimization and reader engagement strategies. Perfect for content creators.',
    whoFor: ['Content Writers', 'Bloggers', 'SEO Specialists'],
    aiModels: ['GPT-3.5', 'GPT-4'],
    tokenUsage: 'Low' as const,
    rating: 4.7,
    reviewCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
    saves: 678,
    copies: 1567,
    comments: 45,
    likes: 234,
    author: { name: 'Emma Thompson', avatar: '' },
    isBookmarked: false,
    isLiked: true
  },
  {
    id: '4',
    title: 'UI Design Analyzer',
    description: 'Analyze UI designs and get suggestions for improvements in accessibility, usability, and visual hierarchy.',
    whoFor: ['UI Designers', 'UX Designers', 'Product Managers'],
    aiModels: ['GPT-4', 'Claude'],
    tokenUsage: 'Medium' as const,
    rating: 4.6,
    reviewCount: 67,
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop',
    saves: 543,
    copies: 987,
    comments: 34,
    likes: 189,
    author: { name: 'Michael Park', avatar: '' },
    isBookmarked: false,
    isLiked: false
  },
  {
    id: '5',
    title: 'Meeting Minutes Generator',
    description: 'Transform meeting recordings into structured minutes with action items and follow-up tasks.',
    whoFor: ['Managers', 'Executives', 'Team Leads'],
    aiModels: ['GPT-4', 'Claude'],
    tokenUsage: 'High' as const,
    rating: 4.8,
    reviewCount: 145,
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop',
    saves: 789,
    copies: 1345,
    comments: 56,
    likes: 298,
    author: { name: 'Lisa Wang', avatar: '' },
    isBookmarked: true,
    isLiked: true
  },
  {
    id: '6',
    title: 'Learning Path Creator',
    description: 'Design personalized learning paths for any topic with resources, milestones, and progress tracking.',
    whoFor: ['Educators', 'Students', 'HR Teams'],
    aiModels: ['GPT-4', 'Gemini'],
    tokenUsage: 'Medium' as const,
    rating: 4.9,
    reviewCount: 203,
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=200&fit=crop',
    saves: 1067,
    copies: 2234,
    comments: 78,
    likes: 456,
    author: { name: 'David Kim', avatar: '' },
    isBookmarked: false,
    isLiked: false
  }
];

const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'saves', label: 'Most Saved' },
  { value: 'copies', label: 'Most Copied' }
];

export default function Browse() {
  const [prompts, setPrompts] = useState(mockPrompts);
  const [filteredPrompts, setFilteredPrompts] = useState(mockPrompts);
  const [isLoading, setIsLoading] = useState(false);
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
      filtered = filtered.filter(prompt => prompt.rating >= filters.minRating);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
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
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Title and Search */}
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-6">
              <div>
                <h1 className="text-2xl font-bold">Browse Prompts</h1>
                <p className="text-sm text-muted-foreground">
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
                  className="pl-10 glass border-border/50 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between lg:justify-end space-x-3">
              {/* Mobile Filters */}
              <div className="lg:hidden">
                <MobileFilters 
                  onFilterChange={handleFilterChange}
                  activeFiltersCount={getActiveFiltersCount()}
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 glass border-border/50">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
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
              <div className="hidden md:flex border border-border/50 rounded-lg p-1 glass">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="w-8 h-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="w-8 h-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <motion.div 
              className="flex items-center space-x-2 mt-4 pt-4 border-t border-border/50"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <div className="flex flex-wrap gap-2">
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
                    {usage} tokens
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
                className="text-xs h-auto p-1 ml-2"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
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
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
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
                className="text-center mt-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="glass border-border/50 hover:bg-primary/5"
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