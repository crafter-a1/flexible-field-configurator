
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  floatLabel?: boolean;
  filled?: boolean;
}

export function PasswordInputField({
  id,
  label,
  value = '',
  onChange,
  placeholder = '',
  required = false,
  helpText,
  className,
  floatLabel = false,
  filled = false
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn('relative space-y-1', className)}>
      {label && (
        <Label 
          htmlFor={id}
          className={cn(
            "text-sm font-medium",
            floatLabel && value ? "absolute top-0 left-3 -translate-y-1/2 bg-background px-1 text-xs" : ""
          )}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cn(
            "pr-10",
            filled && "bg-gray-100",
            floatLabel && "pt-4"
          )}
          aria-describedby={helpText ? `${id}-description` : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-0 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </Button>
      </div>
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default PasswordInputField;
