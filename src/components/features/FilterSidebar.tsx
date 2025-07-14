import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  className?: string;
}

const categories = [
  'Marketing', 'Development', 'Design', 'Writing', 'Business', 
  'Education', 'Research', 'Content', 'Sales', 'Support'
];

const aiModels = [
  'GPT-4', 'GPT-3.5', 'Claude', 'Gemini', 'LLaMA', 'Mistral'
];

const tokenUsages = ['Low', 'Medium', 'High'];

export function FilterSidebar({ onFilterChange, className }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTokenUsage, setSelectedTokenUsage] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState([3]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const updateFilters = (newFilters: any) => {
    const filtersActive = newFilters.categories.length > 0 || 
                        newFilters.models.length > 0 || 
                        newFilters.tokenUsage.length > 0 || 
                        newFilters.minRating > 0;
    
    setHasActiveFilters(filtersActive);
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
    setHasActiveFilters(false);
    onFilterChange({
      categories: [],
      models: [],
      tokenUsage: [],
      minRating: 0
    });
  };

  return (
    <Card className={`glass border-border/50 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-xs h-auto p-1"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Categories</Label>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label 
                  htmlFor={`category-${category}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* AI Models */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">AI Models</Label>
          <div className="space-y-3">
            {aiModels.map((model) => (
              <div key={model} className="flex items-center space-x-2">
                <Checkbox 
                  id={`model-${model}`}
                  checked={selectedModels.includes(model)}
                  onCheckedChange={(checked) => handleModelChange(model, checked as boolean)}
                />
                <Label 
                  htmlFor={`model-${model}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {model}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Token Usage */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Token Usage</Label>
          <div className="space-y-3">
            {tokenUsages.map((usage) => (
              <div key={usage} className="flex items-center space-x-2">
                <Checkbox 
                  id={`token-${usage}`}
                  checked={selectedTokenUsage.includes(usage)}
                  onCheckedChange={(checked) => handleTokenUsageChange(usage, checked as boolean)}
                />
                <Label 
                  htmlFor={`token-${usage}`}
                  className="text-sm cursor-pointer flex-1"
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
          <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
          <div className="space-y-4">
            <div className="px-2">
              <Slider
                value={ratingRange}
                onValueChange={handleRatingChange}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
              <span>Any</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{ratingRange[0]}+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}