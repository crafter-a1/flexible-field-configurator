
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface CollectionCardProps {
  id: string;
  title: string;
  fields: number;
  items?: number;
  lastUpdated: string;
  icon?: string;
  iconColor?: string;
  status?: 'published' | 'draft';
  className?: string;
}

export function CollectionCard({ 
  id,
  title, 
  fields, 
  items = 0,
  lastUpdated, 
  icon = 'P',
  iconColor = 'blue',
  status = 'published',
  className 
}: CollectionCardProps) {
  
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow",
      className
    )}>
      <div className="relative p-4">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/collections/${id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/collections/${id}/fields`}>Configure Fields</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/content?collection=${id}`}>View Content</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-md text-white"
            style={{ backgroundColor: iconColor === 'blue' ? '#0067ff' : iconColor === 'green' ? '#22c55e' : iconColor === 'orange' ? '#f97316' : iconColor === 'purple' ? '#8b5cf6' : iconColor === 'teal' ? '#14b8a6' : '#0067ff' }}
          >
            {icon}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <Badge
              variant={status === 'published' ? 'default' : 'outline'}
              className={`mt-1 ${status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}`}
            >
              {status}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-500">Fields:</span>
            <span className="ml-1 font-medium">{fields}</span>
          </div>
          
          {items > 0 && (
            <div>
              <span className="text-gray-500">Entries:</span>
              <span className="ml-1 font-medium">{items}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
          Last updated: {lastUpdated}
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/collections/${id}/fields`}>Configure</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/content?collection=${id}`}>View Content</Link>
        </Button>
      </div>
    </div>
  );
}
