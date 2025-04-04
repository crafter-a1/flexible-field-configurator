
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IconSelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  helpText?: string | null;
  className?: string;
  disabled?: boolean;
}

export const IconSelectField = ({
  id,
  label,
  value,
  onChange,
  required = false,
  helpText = null,
  className,
  disabled = false
}: IconSelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all available icons from Lucide
  const iconNames = Object.keys(LucideIcons)
    .filter(key => 
      // Filter out non-icon exports
      key !== 'createLucideIcon' && 
      key !== 'default' && 
      typeof LucideIcons[key as keyof typeof LucideIcons] === 'function'
    );
  
  // Filter icons based on search query
  const filteredIcons = searchQuery ? 
    iconNames.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase())) : 
    iconNames;

  // Get the selected icon component
  const getIconComponent = (iconName: string) => {
    if (!iconName) return null;
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return IconComponent ? IconComponent : null;
  };

  const SelectedIcon = getIconComponent(value);

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
            disabled={disabled}
            id={id}
          >
            <div className="flex items-center gap-2">
              {SelectedIcon && React.createElement(SelectedIcon as React.ComponentType, { className: "h-4 w-4" })}
              <span>{value || "Select an icon..."}</span>
            </div>
            <LucideIcons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput 
              placeholder="Search icons..." 
              value={searchQuery} 
              onValueChange={setSearchQuery} 
            />
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <ScrollArea className="h-72">
                  <div className="grid grid-cols-4 gap-2 p-2">
                    {filteredIcons.map((iconName) => {
                      const IconComp = LucideIcons[iconName as keyof typeof LucideIcons];
                      return (
                        <CommandItem
                          key={iconName}
                          onSelect={() => {
                            onChange(iconName);
                            setOpen(false);
                          }}
                          className="flex flex-col items-center justify-center p-2 cursor-pointer"
                        >
                          {React.createElement(IconComp as React.ComponentType, { className: "h-5 w-5" })}
                          <span className="text-xs mt-1 truncate w-full text-center">{iconName}</span>
                        </CommandItem>
                      );
                    })}
                  </div>
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

export default IconSelectField;
