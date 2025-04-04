
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';

interface IconSelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  helpText?: string | null;
  className?: string;
}

type IconKey = keyof typeof Icons;

export const IconSelectField = ({
  id,
  label,
  value,
  onChange,
  required = false,
  helpText = null,
  className
}: IconSelectFieldProps) => {
  const [search, setSearch] = useState('');
  
  // Filter out non-icon exports like "createLucideIcon"
  const iconNames = Object.keys(Icons).filter(
    key => typeof Icons[key as IconKey] === 'function' && key !== 'createLucideIcon'
  ) as IconKey[];
  
  const filteredIcons = iconNames.filter(name => 
    name.toLowerCase().includes(search.toLowerCase())
  );
  
  const selectedIcon = value as IconKey;
  const SelectedIconComponent = selectedIcon && Icons[selectedIcon] ? Icons[selectedIcon] : Icons.HelpCircle;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left font-normal"
            id={id}
          >
            <div className="flex items-center gap-2">
              <SelectedIconComponent className="h-4 w-4" />
              <span className="ml-2">{selectedIcon || "Select an icon"}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="p-2 border-b">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="Search icons..."
                className="h-9 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-4 p-2 gap-1">
              {filteredIcons.map((iconName) => {
                const IconComponent = Icons[iconName];
                return (
                  <Button
                    key={iconName}
                    variant="ghost"
                    className={cn(
                      "h-9 w-full justify-start text-xs p-2",
                      value === iconName && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => onChange(iconName)}
                  >
                    <div className="flex flex-col items-center justify-center w-full">
                      <IconComponent className="h-4 w-4 mb-1" />
                      <span className="truncate max-w-full">{iconName}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      
      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default IconSelectField;
