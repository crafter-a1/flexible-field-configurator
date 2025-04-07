
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BlockEditorField, BlockEditorFieldProps } from './BlockEditorField';
import { validateUIVariant } from '@/utils/inputAdapters';

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
  // Validate UI variant
  const validUIVariant = validateUIVariant(uiVariant);

  // Add UI variant class
  const fieldClassName = cn(
    'space-y-2',
    className,
    `ui-variant-${validUIVariant}`,
    invalid && 'has-error'
  );

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
      />
    </div>
  );
}

export default WysiwygEditorField;
