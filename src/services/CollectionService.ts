
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
  permissions?: string[];
}

export interface CollectionFormData {
  name: string;
  apiId: string;
  description?: string;
  status?: 'published' | 'draft';
  settings?: any;
  permissions?: string[];
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

    // Count fields per collection using a separate query for each collection
    const fieldCounts = {};
    for (const collection of collectionsData) {
      const { count, error } = await supabase
        .from('fields')
        .select('*', { count: 'exact', head: true })
        .eq('collection_id', collection.id);
      
      if (error) {
        console.error("Error counting fields:", error);
      } else {
        fieldCounts[collection.id] = count || 0;
      }
    }

    // Count content items per collection
    const contentCounts = {};
    for (const collection of collectionsData) {
      const { count, error } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('collection_id', collection.id);
      
      if (error) {
        console.error("Error counting content items:", error);
      } else {
        contentCounts[collection.id] = count || 0;
      }
    }

    // Map the data to our Collection interface
    return collectionsData.map((collection) => ({
      id: collection.id,
      title: collection.title,
      apiId: collection.api_id,
      description: collection.description || '',
      icon: collection.icon || 'C',
      iconColor: collection.icon_color || 'blue',
      status: collection.status as 'published' | 'draft',
      fields: fieldCounts[collection.id] || 0,
      items: contentCounts[collection.id] || 0,
      lastUpdated: new Date(collection.updated_at).toLocaleDateString(),
      settings: collection.settings || {},
      permissions: collection.permissions || []
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
  permissions?: string[];
}

export async function createCollection(params: CreateCollectionParams): Promise<Collection> {
  try {
    const { name, apiId, description = '', status = 'published', settings = {}, permissions = [] } = params;
    
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
          settings,
          permissions
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
      description: data.description || '',
      icon: data.icon || 'C',
      iconColor: data.icon_color || 'blue',
      status: data.status as 'published' | 'draft',
      fields: 0,
      items: 0,
      lastUpdated: new Date(data.updated_at).toLocaleDateString(),
      settings: data.settings || {},
      permissions: data.permissions || []
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

// ContentItem interface matches the structure shown in the provided image
export interface ContentItem {
  id: string;
  collection_id: string;
  data: any;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_published?: boolean;
  api_id?: string;
  api_id_plural?: string;
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

    return (data || []).map(item => ({
      ...item,
      status: item.status as 'published' | 'draft'
    }));
  } catch (error) {
    console.error('Error fetching content items:', error);
    throw error;
  }
}

// Field interface matching the structure shown in the provided image
export interface Field {
  id: string;
  name: string;
  api_id: string;
  type: string;
  collection_id: string;
  label?: string;
  description?: string;
  placeholder?: string;
  default_value?: any;
  validation?: any;
  options?: any;
  is_hidden?: boolean;
  position?: number;
  required: boolean;
  ui_options?: any;
  config?: any; // For backward compatibility
  order?: number; // For backward compatibility
}

export async function getFieldsForCollection(collectionId: string): Promise<Field[]> {
  try {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('collection_id', collectionId)
      .order('position', { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map(field => ({
      id: field.id,
      name: field.name,
      api_id: field.api_id,
      type: field.type,
      collection_id: field.collection_id,
      description: field.description,
      label: field.label || field.name,
      placeholder: field.placeholder || '',
      default_value: field.default_value,
      validation: field.validation,
      options: field.options,
      is_hidden: field.is_hidden,
      position: field.sort_order,
      required: field.required || false,
      ui_options: field.ui_options,
      // For backward compatibility
      config: field.settings || {},
      order: field.sort_order
    }));
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
          label: fieldData.label || fieldData.name,
          description: fieldData.description || '',
          placeholder: fieldData.placeholder || '',
          default_value: fieldData.default_value,
          validation: fieldData.validation,
          options: fieldData.options,
          is_hidden: fieldData.is_hidden || false,
          sort_order: fieldData.position || 0,
          required: fieldData.required || false,
          ui_options: fieldData.ui_options,
          settings: fieldData.config || {}
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      api_id: data.api_id,
      type: data.type,
      collection_id: data.collection_id,
      description: data.description,
      label: data.label || data.name,
      placeholder: data.placeholder || '',
      default_value: data.default_value,
      validation: data.validation,
      options: data.options,
      is_hidden: data.is_hidden,
      position: data.sort_order,
      required: data.required || false,
      ui_options: data.ui_options,
      // For backward compatibility
      config: data.settings || {},
      order: data.sort_order
    };
  } catch (error) {
    console.error('Error creating field:', error);
    throw error;
  }
}
