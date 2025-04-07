
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BlockEditorField } from './BlockEditorField';

interface WysiwygEditorFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  minHeight?: string;
  // Add appearance props
  uiVariant?: "standard" | "material" | "pill" | "borderless" | "underlined";
  colors?: Record<string, string>;
  errorMessage?: string;
  invalid?: boolean;
}

export function WysiwygEditorField({
  id,
  label,
  value = '',
  onChange,
  placeholder = 'Enter content...',
  required = false,
  helpText,
  className,
  minHeight = '200px',
  uiVariant = 'standard',
  colors,
  errorMessage,
  invalid
}: WysiwygEditorFieldProps) {
  // Add UI variant class
  const fieldClassName = cn(
    'space-y-2',
    className,
    `ui-variant-${uiVariant}`,
    invalid && 'has-error'
  );

  // We need to spread only the props that BlockEditorField accepts
  // Removing uiVariant and colors from what we pass to BlockEditorField
  return (
    <div className={fieldClassName}>
      <BlockEditorField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        helpText={invalid && errorMessage ? errorMessage : helpText}
        minHeight={minHeight}
        className={className}
        invalid={invalid}
      />
    </div>
  );
}

export default WysiwygEditorField;
