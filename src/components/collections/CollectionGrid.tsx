
import { CollectionCard } from './CollectionCard';
import { CollectionListItem } from './CollectionListItem';

interface Collection {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  fields: number;
  items?: number;
  lastUpdated: string;
  status?: 'published' | 'draft';
}

interface CollectionGridProps {
  collections: Collection[];
  viewMode: 'grid' | 'list';
  sortOption: string;
  onCreateNew?: () => void;
}

export function CollectionGrid({ collections, viewMode, sortOption, onCreateNew }: CollectionGridProps) {
  // Sort collections based on the selected option
  const sortedCollections = [...collections].sort((a, b) => {
    if (sortOption === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'oldest') {
      // This is a simplification - in reality, you'd parse the dates
      return 1; // Just for demo - reverse of 'latest'
    } else {
      // Default to 'latest'
      return -1; // Just for demo - newest first
    }
  });

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-100 text-sm font-medium text-gray-500">
          <div className="col-span-5">Name</div>
          <div className="col-span-2 text-center">Fields</div>
          <div className="col-span-2 text-center">Entries</div>
          <div className="col-span-2">Last Updated</div>
          <div className="col-span-1"></div>
        </div>
        <div className="divide-y divide-gray-100">
          {sortedCollections.map((collection) => (
            <CollectionListItem
              key={collection.id}
              id={collection.id}
              title={collection.title}
              icon={collection.icon}
              iconColor={collection.iconColor}
              fields={collection.fields}
              items={collection.items}
              lastUpdated={collection.lastUpdated}
              status={collection.status}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedCollections.map((collection) => (
        <CollectionCard
          key={collection.id}
          id={collection.id}
          title={collection.title}
          icon={collection.icon}
          iconColor={collection.iconColor}
          fields={collection.fields}
          items={collection.items}
          lastUpdated={collection.lastUpdated}
          status={collection.status}
        />
      ))}
      
      <div 
        className="bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 min-h-[200px] hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={onCreateNew}
      >
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-2xl text-gray-400">+</span>
        </div>
        <p className="text-gray-600">Create Collection</p>
      </div>
    </div>
  );
}
