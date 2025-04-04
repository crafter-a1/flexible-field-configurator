
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DetailItem {
  label: string;
  value: string | React.ReactNode;
}

interface DetailGroupFieldProps {
  id: string;
  title: string;
  description?: string;
  items: DetailItem[];
  className?: string;
  maxHeight?: string | number;
  bordered?: boolean;
  labelWidth?: string | number;
}

export const DetailGroupField = ({
  id,
  title,
  description,
  items = [],
  className,
  maxHeight,
  bordered = true,
  labelWidth = 'auto'
}: DetailGroupFieldProps) => {
  const scrollAreaStyles = {
    maxHeight: maxHeight || undefined,
  };

  const labelStyles = {
    width: labelWidth || 'auto',
  };

  return (
    <Card className={cn(bordered ? '' : 'border-0 shadow-none', className)} id={id}>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea style={scrollAreaStyles}>
          <dl className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <div key={index} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt 
                  className="text-sm font-medium text-gray-900"
                  style={labelStyles}
                >
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DetailGroupField;
