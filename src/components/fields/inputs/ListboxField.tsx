
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronUpDownIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ListboxOption {
  value: string;
  label: string;
}

interface ListboxFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ListboxOption[];
  required?: boolean;
  helpText?: string | null;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const ListboxField = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  helpText = null,
  placeholder = "Select an option...",
  className,
  disabled = false
}: ListboxFieldProps) => {
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    setDisplayValue(selectedOption?.label || '');
  }, [value, options]);

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
            {value ? displayValue : placeholder}
            <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
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

export default ListboxField;
