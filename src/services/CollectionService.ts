
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Collection {
  id: string;
  title: string;
  apiId: string;
  description: string;
  icon: string;
  iconColor: string;
  status: 'published' | 'draft';
  fields: number;
  items?: number;
  lastUpdated: string;
  settings?: any;
}

export interface CollectionFormData {
  name: string;
  apiId: string;
  description?: string;
  status?: 'published' | 'draft';
  settings?: any;
}

export async function fetchCollections(): Promise<Collection[]> {
  try {
    // First, get the collections
    const { data: collectionsData, error: collectionsError } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (collectionsError) {
      throw collectionsError;
    }

    // Then get field counts for each collection using group by
    const { data: fieldsData, error: fieldsError } = await supabase
      .from('fields')
      .select('collection_id, count', { count: 'exact', head: false })
      .group('collection_id');

    if (fieldsError) {
      throw fieldsError;
    }

    // Create a map of collection_id -> field count
    const fieldCountMap = {};
    fieldsData.forEach((item) => {
      fieldCountMap[item.collection_id] = parseInt(item.count, 10);
    });

    // Get content item counts for each collection
    const { data: contentData, error: contentError } = await supabase
      .from('content_items')
      .select('collection_id, count', { count: 'exact', head: false })
      .group('collection_id');

    if (contentError) {
      throw contentError;
    }

    // Create a map of collection_id -> content item count
    const contentCountMap = {};
    contentData.forEach((item) => {
      contentCountMap[item.collection_id] = parseInt(item.count, 10);
    });

    // Map the data to our Collection interface
    return collectionsData.map((collection) => ({
      id: collection.id,
      title: collection.title,
      apiId: collection.api_id,
      description: collection.description,
      icon: collection.icon || 'C',
      iconColor: collection.icon_color || 'blue',
      status: collection.status as 'published' | 'draft',
      fields: fieldCountMap[collection.id] || 0,
      items: contentCountMap[collection.id] || 0,
      lastUpdated: new Date(collection.updated_at).toLocaleDateString(),
      settings: collection.settings || {}
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

export interface CreateCollectionParams {
  name: string;
  apiId: string;
  description?: string;
  status?: 'published' | 'draft';
  settings?: any;
}

export async function createCollection(params: CreateCollectionParams): Promise<Collection> {
  try {
    const { name, apiId, description = '', status = 'published', settings = {} } = params;
    
    const { data, error } = await supabase
      .from('collections')
      .insert([
        { 
          title: name, 
          api_id: apiId, 
          description, 
          status,
          icon: 'C',
          icon_color: 'blue',
          settings 
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      apiId: data.api_id,
      description: data.description,
      icon: data.icon || 'C',
      iconColor: data.icon_color || 'blue',
      status: data.status as 'published' | 'draft',
      fields: 0,
      items: 0,
      lastUpdated: new Date(data.updated_at).toLocaleDateString(),
      settings: data.settings || {}
    };
  } catch (error) {
    console.error('Error creating collection:', error);
    toast({
      title: 'Failed to create collection',
      description: error.message,
      variant: 'destructive'
    });
    throw error;
  }
}

// Add the missing functions
export interface ContentItem {
  id: string;
  collection_id: string;
  data: any;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export async function getContentItems(collectionId: string): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('collection_id', collectionId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching content items:', error);
    throw error;
  }
}

export interface Field {
  id: string;
  name: string;
  api_id: string;
  type: string;
  collection_id: string;
  config: any;
  required: boolean;
  order: number;
}

export async function getFieldsForCollection(collectionId: string): Promise<Field[]> {
  try {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('collection_id', collectionId)
      .order('order', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw error;
  }
}

export async function createField(collectionId: string, fieldData: any): Promise<Field> {
  try {
    const { data, error } = await supabase
      .from('fields')
      .insert([
        {
          collection_id: collectionId,
          name: fieldData.name,
          api_id: fieldData.api_id || fieldData.name.toLowerCase().replace(/\s+/g, '_'),
          type: fieldData.type,
          config: fieldData.config || {},
          required: fieldData.required || false,
          order: fieldData.order || 0
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating field:', error);
    throw error;
  }
}
