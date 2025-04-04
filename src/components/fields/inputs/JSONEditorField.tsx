import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Code } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface JSONEditorFieldProps {
  id: string;
  label?: string;
  value?: any;
  onChange: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  rows?: number;
}

export function JSONEditorField({
  id,
  label,
  value = {},
  onChange,
  placeholder = '{\n  "key": "value"\n}',
  required = false,
  helpText,
  className,
  rows = 10
}: JSONEditorFieldProps) {
  // Keep a string representation for the editor
  const [jsonString, setJsonString] = useState('');
  // Track validation errors
  const [error, setError] = useState<string | null>(null);
  
  // Convert the value to a formatted JSON string when the component mounts or value changes
  useEffect(() => {
    try {
      const formatted = JSON.stringify(value, null, 2);
      setJsonString(formatted);
      setError(null);
    } catch (err) {
      console.error('Failed to parse JSON value:', err);
      setError('Invalid JSON structure');
    }
  }, [value]);
  
  // Handle changes to the JSON string
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newJsonString = e.target.value;
    setJsonString(newJsonString);
    
    try {
      // Try to parse the JSON
      if (newJsonString.trim()) {
        const parsed = JSON.parse(newJsonString);
        onChange(parsed);
        setError(null);
      } else {
        // Empty is valid, set to empty object
        onChange({});
        setError(null);
      }
    } catch (err) {
      // Invalid JSON, don't update the value but show an error
      setError('Invalid JSON: ' + (err as Error).message);
    }
  };
  
  // Format the JSON with prettier indentation
  const formatJSON = () => {
    try {
      if (jsonString.trim()) {
        const parsed = JSON.parse(jsonString);
        const formatted = JSON.stringify(parsed, null, 2);
        setJsonString(formatted);
        setError(null);
      }
    } catch (err) {
      setError('Cannot format invalid JSON: ' + (err as Error).message);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <Label htmlFor={id}>
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={formatJSON}
            className="text-xs"
          >
            <Code className="h-3 w-3 mr-1" /> Format
          </Button>
        </div>
      )}
      
      <Textarea
        id={id}
        value={jsonString}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "font-mono text-sm",
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        )}
        required={required}
        aria-describedby={helpText || error ? `${id}-description` : undefined}
      />
      
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2 text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {helpText && !error && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default JSONEditorField;
