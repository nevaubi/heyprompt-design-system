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
          size="default"
          className="glass border-border/50 relative h-12 px-6"
        >
          <Filter className="w-5 h-5 mr-2" />
          <span className="text-base font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center text-xs font-bold"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="max-h-[70vh] min-h-[60vh] flex flex-col">
        <SheetHeader className="flex-shrink-0 pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-3 text-xl">
              <Filter className="w-6 h-6 text-primary" />
              <span>Filter Prompts</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-sm px-2 py-1">
                  {activeFiltersCount} active
                </Badge>
              )}
            </SheetTitle>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-sm h-10 px-3"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-8 pb-4">
            {/* Categories */}
            <div>
              <Label className="text-lg font-semibold mb-4 block text-foreground">Categories</Label>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3">
                      <Skeleton className="w-5 h-5 rounded" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))
                ) : error ? (
                  <div className="text-base text-muted-foreground py-4">Failed to load categories</div>
                ) : tags.categories.length === 0 ? (
                  <div className="text-base text-muted-foreground py-4">No categories available</div>
                ) : (
                  tags.categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                      <Checkbox 
                        id={`mobile-category-${category.id}`}
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={(checked) => handleCategoryChange(category.name, checked as boolean)}
                        className="w-5 h-5"
                      />
                      <Label 
                        htmlFor={`mobile-category-${category.id}`}
                        className="text-base cursor-pointer flex-1 font-medium"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* AI Models */}
            <div>
              <Label className="text-lg font-semibold mb-4 block text-foreground">AI Models</Label>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3">
                      <Skeleton className="w-5 h-5 rounded" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))
                ) : error ? (
                  <div className="text-base text-muted-foreground py-4">Failed to load AI models</div>
                ) : tags.aiModels.length === 0 ? (
                  <div className="text-base text-muted-foreground py-4">No AI models available</div>
                ) : (
                  tags.aiModels.map((model) => (
                    <div key={model.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                      <Checkbox 
                        id={`mobile-model-${model.id}`}
                        checked={selectedModels.includes(model.name)}
                        onCheckedChange={(checked) => handleModelChange(model.name, checked as boolean)}
                        className="w-5 h-5"
                      />
                      <Label 
                        htmlFor={`mobile-model-${model.id}`}
                        className="text-base cursor-pointer flex-1 font-medium"
                      >
                        {model.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Token Usage */}
            <div>
              <Label className="text-lg font-semibold mb-4 block text-foreground">Token Usage</Label>
              <div className="space-y-3">
                {tokenUsages.map((usage) => (
                  <div key={usage} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                    <Checkbox 
                      id={`mobile-token-${usage}`}
                      checked={selectedTokenUsage.includes(usage)}
                      onCheckedChange={(checked) => handleTokenUsageChange(usage, checked as boolean)}
                      className="w-5 h-5"
                    />
                    <Label 
                      htmlFor={`mobile-token-${usage}`}
                      className="text-base cursor-pointer flex-1 font-medium capitalize"
                    >
                      {usage}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Rating */}
            <div>
              <Label className="text-lg font-semibold mb-4 block text-foreground">Minimum Rating</Label>
              <div className="space-y-6 p-4 bg-muted/30 rounded-lg">
                <Slider
                  value={ratingRange}
                  onValueChange={handleRatingChange}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Any rating</span>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-star text-star" />
                    <span className="font-medium">{ratingRange[0]}+ stars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 pt-6 border-t">
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 h-12 text-base"
            >
              Cancel
            </Button>
            <Button 
              onClick={applyFilters}
              className="flex-1 h-12 text-base bg-gradient-to-r from-primary to-primary-light"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}