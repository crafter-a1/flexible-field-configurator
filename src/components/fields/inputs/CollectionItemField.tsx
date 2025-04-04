import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, ChevronsUpDown, Search, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CollectionItem {
  id: string;
  title: string;
  description?: string;
  [key: string]: any;
}

interface CollectionItemFieldProps {
  id: string;
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  collection: string;
  required?: boolean;
  helpText?: string | null;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  displayField?: string;
  searchFields?: string[];
  disabled?: boolean;
  loading?: boolean;
  items?: CollectionItem[];
  fetchItems?: () => Promise<CollectionItem[]>;
}

export const CollectionItemField = ({
  id,
  label,
  value,
  onChange,
  collection,
  required = false,
  helpText = null,
  placeholder = "Select an item...",
  className,
  multiple = false,
  displayField = "title",
  searchFields = ["title"],
  disabled = false,
  loading = false,
  items: initialItems,
  fetchItems
}: CollectionItemFieldProps) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CollectionItem[]>(initialItems || []);
  const [isLoading, setIsLoading] = useState(loading);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    if (fetchItems && open) {
      setIsLoading(true);
      fetchItems()
        .then(fetchedItems => {
          setItems(fetchedItems);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching collection items:", error);
          setIsLoading(false);
        });
    }
  }, [fetchItems, open]);

  // Filter items based on search
  const filteredItems = search
    ? items.filter(item => {
        return searchFields.some(field => {
          const fieldValue = item[field];
          return fieldValue && fieldValue.toString().toLowerCase().includes(search.toLowerCase());
        });
      })
    : items;
  
  // For displaying selection
  const selectedItems = multiple
    ? items.filter(item => Array.isArray(value) && value.includes(item.id))
    : items.find(item => item.id === value);

  const displayValue = multiple
    ? Array.isArray(selectedItems) && selectedItems.length > 0
      ? selectedItems.map(item => item[displayField]).join(", ")
      : placeholder
    : selectedItems
      ? (selectedItems as CollectionItem)[displayField]
      : placeholder;

  const handleSelect = (itemId: string) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const isSelected = currentValue.includes(itemId);
      
      const newValue = isSelected
        ? currentValue.filter(id => id !== itemId)
        : [...currentValue, itemId];
      
      onChange(newValue);
      
      if (!isSelected) {
        // Keep the popover open for multiple selection
        return;
      }
    } else {
      onChange(itemId);
    }
    
    if (!multiple) {
      setOpen(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled || isLoading}
            id={id}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            <span className="truncate">{displayValue}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={`Search ${collection}...`} 
              value={search}
              onValueChange={setSearch}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>
                {isLoading 
                  ? "Loading..." 
                  : search 
                    ? `No items found for "${search}"`
                    : "No items available"
                }
              </CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  {filteredItems.map((item) => {
                    const isSelected = multiple 
                      ? Array.isArray(value) && value.includes(item.id)
                      : value === item.id;
                      
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={() => handleSelect(item.id)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div>
                            <p className="text-sm font-medium">{item[displayField]}</p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default CollectionItemField;
