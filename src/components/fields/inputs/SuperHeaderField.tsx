
import React from 'react';
import { cn } from '@/lib/utils';

interface SuperHeaderFieldProps {
  id: string;
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'primary' | 'muted' | 'accent';
  align?: 'left' | 'center' | 'right';
  hasDivider?: boolean;
}

export const SuperHeaderField = ({
  id,
  text,
  className,
  size = 'lg',
  color = 'default',
  align = 'left',
  hasDivider = false
}: SuperHeaderFieldProps) => {
  return (
    <div 
      id={id}
      className={cn(
        "my-4",
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right',
        },
        className
      )}
    >
      <h2
        className={cn(
          "font-bold",
          {
            'text-lg': size === 'sm',
            'text-xl': size === 'md',
            'text-2xl': size === 'lg',
            'text-3xl': size === 'xl',
            'text-foreground': color === 'default',
            'text-primary': color === 'primary',
            'text-muted-foreground': color === 'muted',
            'text-blue-600': color === 'accent',
          }
        )}
      >
        {text}
      </h2>
      {hasDivider && (
        <div
          className={cn(
            "mt-2 h-0.5",
            {
              'bg-foreground': color === 'default',
              'bg-primary': color === 'primary',
              'bg-muted': color === 'muted',
              'bg-blue-600': color === 'accent',
            }
          )}
        />
      )}
    </div>
  );
};

export default SuperHeaderField;
