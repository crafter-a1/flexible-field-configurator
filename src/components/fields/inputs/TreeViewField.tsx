
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
}

interface TreeViewFieldProps {
  id: string;
  label: string;
  items: TreeItem[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  required?: boolean;
  helpText?: string | null;
  className?: string;
  multiSelect?: boolean;
}

export const TreeViewField = ({
  id,
  label,
  items,
  selectedIds,
  onChange,
  required = false,
  helpText = null,
  className,
  multiSelect = true
}: TreeViewFieldProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const toggleSelect = (itemId: string) => {
    if (multiSelect) {
      // For multi-select, toggle the selection
      const isSelected = selectedIds.includes(itemId);
      const newSelection = isSelected
        ? selectedIds.filter(id => id !== itemId)
        : [...selectedIds, itemId];
      onChange(newSelection);
    } else {
      // For single select, replace the selection
      onChange([itemId]);
    }
  };

  const renderTreeItems = (treeItems: TreeItem[], depth = 0) => {
    return treeItems.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedNodes[item.id] || false;
      const isSelected = selectedIds.includes(item.id);

      return (
        <div key={item.id} className="select-none">
          <div
            className={cn(
              "flex items-center py-1 px-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
              isSelected && "bg-gray-100 dark:bg-gray-800"
            )}
            style={{ paddingLeft: `${(depth + 1) * 16}px` }}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.id);
                }}
                className="h-5 w-5 p-0 mr-1"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-5 h-5 mr-1" />
            )}

            <div
              className="flex items-center flex-1 gap-2"
              onClick={() => toggleSelect(item.id)}
            >
              {multiSelect ? (
                isSelected ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )
              ) : (
                <div className={cn(
                  "rounded-full w-3 h-3 border border-primary",
                  isSelected && "bg-primary"
                )} />
              )}
              <span>{item.label}</span>
            </div>
          </div>

          {hasChildren && isExpanded && (
            <div className="pl-2">
              {renderTreeItems(item.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Card className="overflow-hidden border border-input">
        <ScrollArea className="h-60 w-full">
          <div className="p-1">
            {renderTreeItems(items)}
          </div>
        </ScrollArea>
      </Card>
      
      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default TreeViewField;
