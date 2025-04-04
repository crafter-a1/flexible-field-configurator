
import React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface DividerFieldProps {
  id: string;
  label?: string;
  className?: string;
  color?: string;
  thickness?: number;
  style?: 'solid' | 'dashed' | 'dotted';
}

export const DividerField = ({
  id,
  label,
  className,
  color = 'muted',
  thickness = 1,
  style = 'solid'
}: DividerFieldProps) => {
  return (
    <div className={cn("py-4", className)} id={id}>
      {label ? (
        <div className="relative flex items-center py-2">
          <Separator 
            className={cn(
              `absolute w-full ${style === 'dashed' ? 'border-dashed' : style === 'dotted' ? 'border-dotted' : 'border-solid'}`,
              {
                'bg-primary border-primary': color === 'primary',
                'bg-muted border-muted': color === 'muted',
                'bg-destructive border-destructive': color === 'destructive',
                'bg-gray-200 border-gray-200': color === 'light',
                'bg-gray-800 border-gray-800': color === 'dark',
              }
            )}
            style={{ height: `${thickness}px` }}
          />
          <span className="relative bg-background px-2 text-sm font-medium text-muted-foreground">
            {label}
          </span>
        </div>
      ) : (
        <Separator 
          className={cn(
            `w-full ${style === 'dashed' ? 'border-dashed' : style === 'dotted' ? 'border-dotted' : 'border-solid'}`,
            {
              'bg-primary border-primary': color === 'primary',
              'bg-muted border-muted': color === 'muted',
              'bg-destructive border-destructive': color === 'destructive',
              'bg-gray-200 border-gray-200': color === 'light',
              'bg-gray-800 border-gray-800': color === 'dark',
            }
          )}
          style={{ height: `${thickness}px` }}
        />
      )}
    </div>
  );
};

export default DividerField;
