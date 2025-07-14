import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, Star, X } from 'lucide-react';
import { useState } from 'react';
import { useTags } from '@/hooks/useTags';

interface MobileFiltersProps {
  onFilterChange: (filters: any) => void;
  activeFiltersCount: number;
}

const tokenUsages = ['low', 'medium', 'high'];

export function MobileFilters({ onFilterChange, activeFiltersCount }: MobileFiltersProps) {
  const { tags, isLoading, error } = useTags();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTokenUsage, setSelectedTokenUsage] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState([0]);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (newFilters: any) => {
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    
    setSelectedCategories(newCategories);
    updateFilters({
      categories: newCategories,
      models: selectedModels,
      tokenUsage: selectedTokenUsage,
      minRating: ratingRange[0]
    });
  };

  const handleModelChange = (model: string, checked: boolean) => {
    const newModels = checked
      ? [...selectedModels, model]
      : selectedModels.filter(m => m !== model);
    
    setSelectedModels(newModels);
    updateFilters({
      categories: selectedCategories,
      models: newModels,
      tokenUsage: selectedTokenUsage,
      minRating: ratingRange[0]
    });
  };

  const handleTokenUsageChange = (usage: string, checked: boolean) => {
    const newTokenUsage = checked
      ? [...selectedTokenUsage, usage]
      : selectedTokenUsage.filter(u => u !== usage);
    
    setSelectedTokenUsage(newTokenUsage);
    updateFilters({
      categories: selectedCategories,
      models: selectedModels,
      tokenUsage: newTokenUsage,
      minRating: ratingRange[0]
    });
  };

  const handleRatingChange = (value: number[]) => {
    setRatingRange(value);
    updateFilters({
      categories: selectedCategories,
      models: selectedModels,
      tokenUsage: selectedTokenUsage,
      minRating: value[0]
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedModels([]);
    setSelectedTokenUsage([]);
    setRatingRange([0]);
    updateFilters({
      categories: [],
      models: [],
      tokenUsage: [],
      minRating: 0
    });
  };

  const applyFilters = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="glass border-border/50 relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="border-b border-border/50 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </SheetTitle>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs h-auto p-2"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(80vh-140px)]">
          <div className="space-y-6 pr-4">
            {/* Categories */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Categories</Label>
              <div className="grid grid-cols-2 gap-3">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                ) : error ? (
                  <div className="text-sm text-muted-foreground col-span-2">Failed to load categories</div>
                ) : tags.categories.length === 0 ? (
                  <div className="text-sm text-muted-foreground col-span-2">No categories available</div>
                ) : (
                  tags.categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mobile-category-${category.id}`}
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={(checked) => handleCategoryChange(category.name, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`mobile-category-${category.id}`}
                        className="text-sm cursor-pointer flex-1 leading-none"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator />

            {/* AI Models */}
            <div>
              <Label className="text-sm font-medium mb-3 block">AI Models</Label>
              <div className="grid grid-cols-2 gap-3">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                ) : error ? (
                  <div className="text-sm text-muted-foreground col-span-2">Failed to load AI models</div>
                ) : tags.aiModels.length === 0 ? (
                  <div className="text-sm text-muted-foreground col-span-2">No AI models available</div>
                ) : (
                  tags.aiModels.map((model) => (
                    <div key={model.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mobile-model-${model.id}`}
                        checked={selectedModels.includes(model.name)}
                        onCheckedChange={(checked) => handleModelChange(model.name, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`mobile-model-${model.id}`}
                        className="text-sm cursor-pointer flex-1 leading-none"
                      >
                        {model.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator />

            {/* Token Usage */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Token Usage</Label>
              <div className="grid grid-cols-3 gap-3">
                {tokenUsages.map((usage) => (
                  <div key={usage} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`mobile-token-${usage}`}
                      checked={selectedTokenUsage.includes(usage)}
                      onCheckedChange={(checked) => handleTokenUsageChange(usage, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`mobile-token-${usage}`}
                      className="text-sm cursor-pointer flex-1 leading-none"
                    >
                      {usage.charAt(0).toUpperCase() + usage.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Rating */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
              <div className="space-y-4 px-2">
                <Slider
                  value={ratingRange}
                  onValueChange={handleRatingChange}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Any</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-star text-star" />
                    <span>{ratingRange[0]}+ stars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex space-x-3 pt-4 border-t border-border/50">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={applyFilters}
            className="flex-1 bg-gradient-to-r from-primary to-primary-light"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}