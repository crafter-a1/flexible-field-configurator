
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HashInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  helpText?: string | null;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
}

export const HashInputField = ({
  id,
  label,
  value,
  onChange,
  required = false,
  helpText = null,
  placeholder = "Enter hash value...",
  className,
  readOnly = false,
  disabled = false
}: HashInputFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    // Ensure hash values start with # if they don't already
    if (newValue && !newValue.startsWith('#')) {
      newValue = `#${newValue}`;
    }
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-7"
          disabled={disabled}
          readOnly={readOnly}
        />
        {(!value || !value.startsWith('#')) && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            #
          </span>
        )}
      </div>
      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default HashInputField;
