import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, Star, X } from 'lucide-react';
import { useState } from 'react';

interface MobileFiltersProps {
  onFilterChange: (filters: any) => void;
  activeFiltersCount: number;
}

const categories = [
  'Marketing', 'Development', 'Design', 'Writing', 'Business', 
  'Education', 'Research', 'Content', 'Sales', 'Support'
];

const aiModels = [
  'GPT-4', 'GPT-3.5', 'Claude', 'Gemini', 'LLaMA', 'Mistral'
];

const tokenUsages = ['Low', 'Medium', 'High'];

export function MobileFilters({ onFilterChange, activeFiltersCount }: MobileFiltersProps) {
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
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`mobile-category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`mobile-category-${category}`}
                      className="text-sm cursor-pointer flex-1 leading-none"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* AI Models */}
            <div>
              <Label className="text-sm font-medium mb-3 block">AI Models</Label>
              <div className="grid grid-cols-2 gap-3">
                {aiModels.map((model) => (
                  <div key={model} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`mobile-model-${model}`}
                      checked={selectedModels.includes(model)}
                      onCheckedChange={(checked) => handleModelChange(model, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`mobile-model-${model}`}
                      className="text-sm cursor-pointer flex-1 leading-none"
                    >
                      {model}
                    </Label>
                  </div>
                ))}
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
                      {usage}
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