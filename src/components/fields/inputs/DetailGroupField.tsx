
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DetailItem {
  id: string;
  label: string;
  value: React.ReactNode;
}

interface DetailGroupFieldProps {
  id: string;
  title: string;
  description?: string;
  items: DetailItem[];
  className?: string;
  maxHeight?: number;
  bordered?: boolean;
  labelWidth?: 'auto' | 'narrow' | 'wide' | 'equal';
}

export const DetailGroupField = ({
  id,
  title,
  description,
  items,
  className,
  maxHeight,
  bordered = true,
  labelWidth = 'auto'
}: DetailGroupFieldProps) => {
  const labelClass = cn({
    'w-1/3': labelWidth === 'narrow',
    'w-1/2': labelWidth === 'wide',
    'w-1/2': labelWidth === 'equal',
    'w-1/4': labelWidth === 'auto',
  });

  const valueClass = cn({
    'w-2/3': labelWidth === 'narrow',
    'w-1/2': labelWidth === 'wide',
    'w-1/2': labelWidth === 'equal',
    'w-3/4': labelWidth === 'auto',
  });

  const content = (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id} className="flex flex-col sm:flex-row">
          <div className={cn("font-medium text-muted-foreground mb-1 sm:mb-0", labelClass)}>
            {item.label}
          </div>
          <div className={valueClass}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card
      id={id}
      className={cn(
        "w-full",
        !bordered && "border-0 shadow-none",
        className
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {maxHeight ? (
          <ScrollArea className="pr-4" style={{ maxHeight: `${maxHeight}px` }}>
            {content}
          </ScrollArea>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  );
};

export default DetailGroupField;
