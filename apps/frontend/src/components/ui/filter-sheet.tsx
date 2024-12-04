import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import { Slider } from "./slider";
import { Badge } from "./badge";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "../../lib/utils";

// Update FilterOption to be generic
export interface FilterOption<T extends string = string> {
  id: T;  // Now id must match the generic type T
  label: string;
  type: 'select' | 'slider' | 'radio';
  options?: { value: string; label: string }[];
  range?: { min: number; max: number; step: number };
  value: string | number;
  defaultValue?: string | number; // Add defaultValue for handling "All" option
}

// Update FilterSheetProps to use the generic FilterOption
interface FilterSheetProps<T extends string> {
  filters: FilterOption<T>[];  // Use generic FilterOption
  onFilterChange: (filterId: T, value: string | number) => void;
  onReset: () => void;
}

// Update the FilterSheet component
export function FilterSheet<T extends string>({ 
  filters, 
  onFilterChange, 
  onReset 
}: FilterSheetProps<T>) {
  // Update activeFiltersCount calculation
  const activeFiltersCount = filters.filter(f => {
    if (f.type === 'select') {
      return f.value !== 'all' && f.value !== '';
    }
    if (f.type === 'slider') {
      return f.value !== f.range?.min;
    }
    return false;
  }).length;

  // Update the reset handler in the Reset All Filters button
  const handleReset = () => {
    filters.forEach(filter => {
      const defaultValue = filter.type === 'slider' 
        ? filter.range?.min || 0 
        : filter.defaultValue || 'all';
      onFilterChange(filter.id, defaultValue); // filter.id is now type T
    });
    onReset();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "border-border hover:bg-accent",
            activeFiltersCount > 0 && "border-primary bg-accent"
          )}
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary"
              className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[340px] sm:w-[400px] bg-background">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-2xl font-semibold text-foreground">Filter Options</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Refine your search with specific criteria
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-6">
          {filters.map((filter) => (
            <div key={filter.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">{filter.label}</h4>
                {filter.value !== (filter.type === 'slider' ? filter.range?.min : '') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={() => onFilterChange(filter.id, filter.type === 'slider' ? filter.range?.min || 0 : '')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {filter.type === 'select' && (
                <Select
                  key={`${filter.id}-${filter.value}`} // Add this key prop
                  value={filter.value?.toString()}
                  onValueChange={(value) => onFilterChange(filter.id, value)}
                >
                  <SelectTrigger className="w-full border-border focus:ring-ring">
                    <SelectValue placeholder={`Select ${filter.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={filter.defaultValue?.toString() || 'all'}>
                      All {filter.label}s
                    </SelectItem>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {filter.type === 'slider' && filter.range && (
                <div className="space-y-2">
                  <Slider
                    key={`${filter.id}-${filter.value}`} // Add this key prop
                    defaultValue={[Number(filter.value)]}
                    value={[Number(filter.value)]}
                    min={filter.range.min}
                    max={filter.range.max}
                    step={filter.range.step}
                    onValueChange={(value) => onFilterChange(filter.id, value[0])}
                    className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{filter.range.min}</span>
                    <span className="font-medium text-primary">
                      {filter.value} {filter.id === 'rating' ? '★' : ''}
                    </span>
                    <span>{filter.range.max}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-accent"
                onClick={handleReset}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
