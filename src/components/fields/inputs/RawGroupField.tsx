
import React from 'react';
import { cn } from '@/lib/utils';

interface RawGroupFieldProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const RawGroupField = ({
  id,
  children,
  className
}: RawGroupFieldProps) => {
  return (
    <div id={id} className={cn("w-full", className)}>
      {children}
    </div>
  );
};

export default RawGroupField;
