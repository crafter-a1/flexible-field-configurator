
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Collection {
  id: string;
  api_id: string;
  title: string;
  description?: string;
  icon: string;
  iconColor: string;
  fields: number;
  items: number;
  lastUpdated: string;
  status: 'published' | 'draft';
  settings?: CollectionSettings;
}

export interface CollectionSettings {
  defaultView?: 'grid' | 'list';
  defaultSorting?: 'createdDate' | 'updatedDate' | 'name';
  itemsPerPage?: string;
  enableApiAccess?: boolean;
  requireAuthentication?: boolean;
  enableVersioning?: boolean;
}

export interface CollectionFormData {
  name: string;
  apiId: string;
  description?: string;
  status?: 'published' | 'draft';
  settings?: CollectionSettings;
}

// Fetch all collections
export const fetchCollections = async (): Promise<Collection[]> => {
  try {
    // Get collections
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .select('*');
      
    if (collectionsError) throw collectionsError;
    
    // Get fields counts
    const { data: fieldsCount, error: fieldsError } = await supabase
      .from('fields')
      .select('collection_id, count')
      .group('collection_id');
      
    if (fieldsError) throw fieldsError;
    
    // Get content items counts
    const { data: itemsCount, error: itemsError } = await supabase
      .from('content_items')
      .select('collection_id, count')
      .group('collection_id');
      
    if (itemsError) throw itemsError;
    
    // Map to our Collection interface
    return collections.map(collection => {
      // Find fields count for this collection
      const fieldCount = fieldsCount.find(f => f.collection_id === collection.id);
      // Find items count for this collection
      const itemCount = itemsCount.find(i => i.collection_id === collection.id);
      
      // Format relative time
      const updatedAt = new Date(collection.updated_at);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60));
      
      let lastUpdated = 'Just now';
      if (diffInMinutes > 1440) {
        const days = Math.floor(diffInMinutes / 1440);
        lastUpdated = `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes > 60) {
        const hours = Math.floor(diffInMinutes / 60);
        lastUpdated = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes > 1) {
        lastUpdated = `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      }
      
      return {
        id: collection.api_id,
        api_id: collection.api_id,
        title: collection.title,
        description: collection.description,
        icon: collection.icon || collection.title.charAt(0).toUpperCase(),
        iconColor: collection.icon_color || 'blue',
        fields: fieldCount ? parseInt(fieldCount.count) : 0,
        items: itemCount ? parseInt(itemCount.count) : 0,
        lastUpdated,
        status: collection.status as 'published' | 'draft',
        settings: collection.settings
      };
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    toast({
      title: "Error fetching collections",
      description: "Please try again later",
      variant: "destructive",
    });
    return [];
  }
};

// Create a new collection
export const createCollection = async (collectionData: CollectionFormData): Promise<Collection | null> => {
  try {
    const { name, apiId, description, status = 'published', settings } = collectionData;
    
    // Insert new collection
    const { data: newCollection, error } = await supabase
      .from('collections')
      .insert({
        api_id: apiId,
        title: name,
        description: description || null,
        icon: name.charAt(0).toUpperCase(),
        icon_color: getRandomColor(),
        status: status,
        settings: settings || {}
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: newCollection.api_id,
      api_id: newCollection.api_id,
      title: newCollection.title,
      description: newCollection.description,
      icon: newCollection.icon || newCollection.title.charAt(0).toUpperCase(),
      iconColor: newCollection.icon_color || 'blue',
      fields: 0,
      items: 0,
      lastUpdated: 'Just now',
      status: newCollection.status as 'published' | 'draft',
      settings: newCollection.settings
    };
  } catch (error) {
    console.error('Error creating collection:', error);
    toast({
      title: "Error creating collection",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
};

// Get a random color for collection icon
export const getRandomColor = () => {
  const colors = ['blue', 'green', 'orange', 'purple', 'teal'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get fields for a collection
export const getFieldsForCollection = async (collectionId: string) => {
  try {
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('*')
      .eq('api_id', collectionId)
      .single();
      
    if (collectionError) throw collectionError;
    
    const { data: fields, error: fieldsError } = await supabase
      .from('fields')
      .select('*')
      .eq('collection_id', collection.id)
      .order('sort_order', { ascending: true });
      
    if (fieldsError) throw fieldsError;
    
    return fields.map(field => ({
      id: field.api_id,
      name: field.name,
      type: field.type,
      required: field.required,
      description: field.description,
      settings: field.settings
    }));
  } catch (error) {
    console.error('Error fetching fields:', error);
    toast({
      title: "Error fetching fields",
      description: "Please try again later",
      variant: "destructive",
    });
    return [];
  }
};

// Create a new field for a collection
export const createField = async (collectionId: string, fieldData: any) => {
  try {
    // First get the collection UUID
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('api_id', collectionId)
      .single();
      
    if (collectionError) throw collectionError;
    
    // Then create the field
    const { data: field, error: fieldError } = await supabase
      .from('fields')
      .insert({
        collection_id: collection.id,
        name: fieldData.name,
        api_id: fieldData.apiId || fieldData.name.toLowerCase().replace(/\s+/g, '_'),
        type: fieldData.type,
        required: fieldData.required || false,
        description: fieldData.description || null,
        settings: fieldData.settings || {},
      })
      .select()
      .single();
      
    if (fieldError) throw fieldError;
    
    return {
      id: field.api_id,
      name: field.name,
      type: field.type,
      required: field.required,
      description: field.description,
      settings: field.settings
    };
  } catch (error) {
    console.error('Error creating field:', error);
    toast({
      title: "Error creating field",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
};

// Get content items for a collection
export const getContentItems = async (collectionId: string) => {
  try {
    // First get the collection UUID
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('api_id', collectionId)
      .single();
      
    if (collectionError) throw collectionError;
    
    // Then get content items
    const { data: items, error: itemsError } = await supabase
      .from('content_items')
      .select('*')
      .eq('collection_id', collection.id);
      
    if (itemsError) throw itemsError;
    
    return items;
  } catch (error) {
    console.error('Error fetching content items:', error);
    toast({
      title: "Error fetching content",
      description: "Please try again later",
      variant: "destructive",
    });
    return [];
  }
};
