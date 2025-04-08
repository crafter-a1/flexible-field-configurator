import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { normalizeAppearanceSettings, validateUIVariant } from '@/utils/inputAdapters';
import { toast } from '@/hooks/use-toast';
import { GeneralSettings, AdvancedSettings } from '@/utils/fieldSettingsHelpers';

export interface ValidationSettings {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  unique?: boolean;
  message?: string;
  maxTags?: number;
  [key: string]: any;
}

export interface AppearanceSettings {
  uiVariant?: "standard" | "material" | "pill" | "borderless" | "underlined";
  textAlign?: string;
  labelPosition?: string;
  labelWidth?: number;
  floatLabel?: boolean;
  filled?: boolean;
  showBorder?: boolean;
  showBackground?: boolean;
  roundedCorners?: string;
  fieldSize?: string;
  labelSize?: string;
  customClass?: string;
  customCss?: string;
  colors?: Record<string, string>;
  isDarkMode?: boolean;
  responsive?: {
    mobile?: Record<string, any>;
    tablet?: Record<string, any>;
    desktop?: Record<string, any>;
  };
  [key: string]: any;
}

export interface Collection {
  id: string;
  title: string;
  apiId: string;
  description?: string;
  status: string;
  fields?: any[];
  createdAt: string;
  updatedAt: string;
  icon?: string;
  iconColor?: string;
  items?: number;
  lastUpdated?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionFormData {
  name: string;
  apiId: string;
  description?: string;
  status?: string;
  settings?: Record<string, any>;
}

export interface CollectionField {
  id: string;
  name: string;
  apiId: string;
  type: string;
  description?: string;
  required: boolean;
  settings?: {
    validation?: ValidationSettings;
    appearance?: AppearanceSettings;
    advanced?: Record<string, any>;
    ui_options?: Record<string, any>;
    helpText?: string;
    [key: string]: any;
  };
  validation_settings?: ValidationSettings;
  appearance_settings?: AppearanceSettings;
  advanced_settings?: Record<string, any>;
  ui_options_settings?: Record<string, any>;
  general_settings?: GeneralSettings;
  validation?: ValidationSettings;
  appearance?: AppearanceSettings;
  advanced?: Record<string, any>;
  ui_options?: Record<string, any>;
  helpText?: string;
  sort_order?: number;
  collection_id?: string;
  placeholder?: string;
  keyFilter?: string;
  min?: number;
  max?: number;
  length?: number;
  maxTags?: number;
  prefix?: string;
  suffix?: string;
  rows?: number;
  minHeight?: string;
}

type SupabaseFieldRow = Database['public']['Tables']['fields']['Row'] & {
  validation_settings?: ValidationSettings;
  appearance_settings?: AppearanceSettings;
  advanced_settings?: AdvancedSettings;
  ui_options_settings?: Record<string, any>;
  general_settings?: GeneralSettings;
};

type ExtendedFieldRow = Database['public']['Tables']['fields']['Row'] & {
  validation_settings?: ValidationSettings;
  appearance_settings?: AppearanceSettings;
  advanced_settings?: AdvancedSettings;
  ui_options_settings?: Record<string, any>;
  general_settings?: GeneralSettings;
};

const mapSupabaseCollection = (collection: Database['public']['Tables']['collections']['Row']): Collection => {
  return {
    id: collection.id,
    title: collection.title,
    apiId: collection.api_id,
    description: collection.description || undefined,
    status: collection.status,
    createdAt: collection.created_at,
    updatedAt: collection.updated_at,
    icon: collection.icon || 'file',
    iconColor: collection.icon_color || 'gray',
    items: 0,
    lastUpdated: collection.updated_at,
    created_at: collection.created_at,
    updated_at: collection.updated_at
  };
};

const mapSupabaseField = (field: ExtendedFieldRow): CollectionField => {
  const settings = field.settings as Record<string, any> || {};

  // Debug logging for field mapping
  console.log(`Mapping field ${field.name} from database:`, {
    fieldId: field.id,
    fieldName: field.name,
    fieldType: field.type,
    settings
  });

  // Extract settings from both the old and new structure
  const validationSettings = field.validation_settings as ValidationSettings || settings.validation || {};
  const appearanceSettings = field.appearance_settings as AppearanceSettings || settings.appearance || {};
  const advancedSettings = field.advanced_settings as AdvancedSettings || settings.advanced || {};
  const uiOptionsSettings = field.ui_options_settings as Record<string, any> || settings.ui_options || {};
  const generalSettings = field.general_settings as GeneralSettings || {};

  // Extract helpText and placeholder from the right place - prefer general_settings, then fallback
  const helpText = generalSettings.helpText || settings.helpText || uiOptionsSettings.help_text;
  const placeholder = generalSettings.placeholder || uiOptionsSettings.placeholder || '';
  
  // Add helpText and placeholder to general settings if it exists but isn't already there
  const enhancedGeneralSettings = {...generalSettings};
  if (helpText && !enhancedGeneralSettings.helpText) {
    enhancedGeneralSettings.helpText = helpText;
  }
  if (placeholder && !enhancedGeneralSettings.placeholder) {
    enhancedGeneralSettings.placeholder = placeholder;
  }

  // Log appearance settings specifically
  if (appearanceSettings) {
    console.log(`Appearance settings for field ${field.name}:`, JSON.stringify(appearanceSettings, null, 2));
  }
  
  // Log general settings specifically
  if (enhancedGeneralSettings) {
    console.log(`General settings for field ${field.name}:`, JSON.stringify(enhancedGeneralSettings, null, 2));
  }
  
  // Ensure appearance settings are properly normalized
  const normalizedAppearance = normalizeAppearanceSettings(appearanceSettings);

  return {
    id: field.id,
    name: field.name,
    apiId: field.api_id,
    type: field.type,
    description: field.description || undefined,
    required: field.required || false,
    settings: settings,
    validation_settings: validationSettings,
    appearance_settings: normalizedAppearance,
    advanced_settings: advancedSettings,
    ui_options_settings: uiOptionsSettings,
    general_settings: enhancedGeneralSettings,
    sort_order: field.sort_order || 0,
    collection_id: field.collection_id || undefined,
    
    // Legacy structure references for backward compatibility
    validation: validationSettings,
    appearance: normalizedAppearance,
    advanced: advancedSettings,
    ui_options: uiOptionsSettings,
    helpText: helpText,
    placeholder: placeholder
  };
};

const deepMerge = (target: any, source: any): any => {
  // Return source if target is null/undefined or not an object
  if (target === null || target === undefined || typeof target !== 'object') {
    return source === undefined ? target : source;
  }
  
  // Return target if source is null/undefined
  if (source === null || source === undefined) {
    return target;
  }
  
  // Handle arrays: replace entire array unless explicitly stated to merge
  if (Array.isArray(target) && Array.isArray(source)) {
    return source; // Replace arrays by default
  }
  
  // Both are objects, create a new object for the result
  const output = { ...target };
  
  // Iterate through source properties
  Object.keys(source).forEach(key => {
    // Skip undefined values to prevent overwriting with undefined
    if (source[key] === undefined) {
      return;
    }
    
    // If property exists in target and both values are objects, merge recursively
    if (
      key in target && 
      source[key] !== null && 
      target[key] !== null && 
      typeof source[key] === 'object' && 
      typeof target[key] === 'object' &&
      !Array.isArray(source[key]) && 
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      // Otherwise use source value (for primitive values, arrays, or when target doesn't have the property)
      output[key] = source[key];
    }
  });
  
  return output;
};

const isObject = (item: any): boolean => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

const DEBUG_ENABLED = true;

const debugLog = (message: string, data?: any) => {
  if (DEBUG_ENABLED) {
    console.log(`[CollectionService] ${message}`, data ? data : '');
  }
};

export const CollectionService = {
  getFieldsForCollection: async (collectionId: string): Promise<CollectionField[]> => {
    debugLog(`Fetching fields for collection: ${collectionId}`);
    try {
      const { data: fields, error } = await supabase
        .from('fields')
        .select('*')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching fields:', error);
        throw error;
      }

      debugLog(`Successfully fetched ${fields.length} fields`);
      return fields.map(mapSupabaseField);
    } catch (error) {
      console.error('Failed to fetch fields:', error);
      return [];
    }
  },

  createField: async (collectionId: string, fieldData: Partial<CollectionField>): Promise<CollectionField> => {
    try {
      debugLog(`Creating new field in collection ${collectionId}:`, fieldData);
      
      // First get the highest sort_order to add the new field at the bottom
      const { data: existingFields, error: countError } = await supabase
        .from('fields')
        .select('sort_order')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: false })
        .limit(1);

      if (countError) {
        console.error('Error getting existing fields:', countError);
      }

      // Get the highest sort_order or use 0 if no fields exist
      const highestSortOrder = existingFields && existingFields.length > 0
        ? (existingFields[0].sort_order || 0) + 1
        : 0;

      debugLog(`Highest sort order is: ${highestSortOrder}`);

      const { apiId, ...restData } = fieldData;

      // Extract general settings from fieldData comprehensively
      const generalSettings: GeneralSettings = {
        placeholder: fieldData.placeholder || fieldData.settings?.ui_options?.placeholder || "",
        helpText: fieldData.helpText || fieldData.settings?.helpText || fieldData.settings?.ui_options?.help_text || "",
        hidden_in_forms: fieldData.settings?.ui_options?.hidden_in_forms || false
      };
      
      // Add field type specific settings to general_settings
      if (fieldData.keyFilter !== undefined) generalSettings.keyFilter = fieldData.keyFilter;
      if (fieldData.min !== undefined) generalSettings.minValue = fieldData.min;
      if (fieldData.max !== undefined) generalSettings.maxValue = fieldData.max;
      if (fieldData.length !== undefined) generalSettings.otpLength = fieldData.length;
      if (fieldData.maxTags !== undefined) generalSettings.maxTags = fieldData.maxTags;
      if (fieldData.prefix !== undefined) generalSettings.prefix = fieldData.prefix;
      if (fieldData.suffix !== undefined) generalSettings.suffix = fieldData.suffix;
      if (fieldData.rows !== undefined) generalSettings.rows = fieldData.rows;
      if (fieldData.minHeight !== undefined) generalSettings.minHeight = fieldData.minHeight;
      
      // Merge with explicitly provided general settings
      if (fieldData.general_settings) {
        Object.assign(generalSettings, fieldData.general_settings);
      }

      // Set up field data using the new columns structure
      const field: any = {
        name: fieldData.name || 'New Field',
        api_id: apiId || fieldData.name?.toLowerCase().replace(/\s+/g, '_') || 'new_field',
        type: fieldData.type || 'text',
        collection_id: collectionId,
        description: fieldData.description || null,
        required: fieldData.required || false,
        sort_order: highestSortOrder,
      
        // Initialize with proper settings objects
        validation_settings: fieldData.validation_settings || fieldData.settings?.validation || {},
        appearance_settings: normalizeAppearanceSettings(fieldData.appearance_settings || fieldData.settings?.appearance || {}),
        advanced_settings: fieldData.advanced_settings || fieldData.settings?.advanced || {},
        ui_options_settings: fieldData.ui_options_settings || {}, // Don't store UI options here anymore
        general_settings: generalSettings // Comprehensive general settings
      };
      
      // Maintain backward compatibility with settings
      const settings: Record<string, any> = {};
      
      if (field.validation_settings && Object.keys(field.validation_settings).length > 0) {
        settings.validation = field.validation_settings;
      }
      
      if (field.appearance_settings && Object.keys(field.appearance_settings).length > 0) {
        settings.appearance = field.appearance_settings;
      }
      
      if (field.advanced_settings && Object.keys(field.advanced_settings).length > 0) {
        settings.advanced = field.advanced_settings;
      }
      
      // Only add settings if we have some data
      if (Object.keys(settings).length > 0 || fieldData.settings) {
        field.settings = { ...settings, ...(fieldData.settings || {}) };
      }

      debugLog('Inserting field into database:', field);

      const { data, error } = await supabase
        .from('fields')
        .insert([field])
        .select()
        .single();

      if (error) {
        console.error('Error creating field:', error);
        toast({
          title: "Error creating field",
          description: `Database error: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }
      
      debugLog('Field created successfully:', data);
      
      toast({
        title: "Field created",
        description: `The field "${field.name}" was successfully created`,
      });
      
      return mapSupabaseField(data);
    } catch (error: any) {
      console.error('Failed to create field:', error);
      toast({
        title: "Field creation failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      throw error;
    }
  },

  updateField: async (collectionId: string, fieldId: string, fieldData: Partial<CollectionField>): Promise<CollectionField> => {
    try {
      debugLog(`Updating field ${fieldId} in collection ${collectionId}:`, fieldData);
      debugLog(`Original field data:`, JSON.stringify(fieldData, null, 2));
      
      const updateData: any = {};

      // Map basic field properties
      if (fieldData.name) updateData.name = fieldData.name;
      if (fieldData.apiId) updateData.api_id = fieldData.apiId;
      if (fieldData.type) updateData.type = fieldData.type;
      if (fieldData.description !== undefined) updateData.description = fieldData.description;
      if (fieldData.required !== undefined) updateData.required = fieldData.required;
      if (fieldData.sort_order !== undefined) updateData.sort_order = fieldData.sort_order;

      // Get current field data to properly merge with updates
      const { data: currentField, error: getCurrentError } = await supabase
        .from('fields')
        .select('*')
        .eq('id', fieldId)
        .single();

      if (getCurrentError) {
        console.error('Error retrieving current field data:', getCurrentError);
        throw getCurrentError;
      }

      // Cast to our extended type
      const currentFieldExtended = currentField as ExtendedFieldRow;

      debugLog(`Current field data from database:`, JSON.stringify(currentFieldExtended, null, 2));
      
      // New column-based approach
    
      // Handle validation settings
      if (fieldData.validation_settings || fieldData.settings?.validation) {
        const newValidation = fieldData.validation_settings || fieldData.settings?.validation || {};
        const currentValidation = currentFieldExtended.validation_settings || {};
        updateData.validation_settings = deepMerge(currentValidation, newValidation);
        debugLog('[updateField] New validation settings:', JSON.stringify(updateData.validation_settings, null, 2));
      }
      
      // Handle appearance settings
      if (fieldData.appearance_settings || fieldData.settings?.appearance) {
        const newAppearance = fieldData.appearance_settings || fieldData.settings?.appearance || {};
        const currentAppearance = currentFieldExtended.appearance_settings || {};
        // Normalize appearance settings
        updateData.appearance_settings = normalizeAppearanceSettings(deepMerge(currentAppearance, newAppearance));
        debugLog('[updateField] New appearance settings:', JSON.stringify(updateData.appearance_settings, null, 2));
      }
      
      // Handle advanced settings
      if (fieldData.advanced_settings || fieldData.settings?.advanced) {
        const newAdvanced = fieldData.advanced_settings || fieldData.settings?.advanced || {};
        const currentAdvanced = currentFieldExtended.advanced_settings || {};
        updateData.advanced_settings = deepMerge(currentAdvanced, newAdvanced);
        debugLog('[updateField] New advanced settings:', JSON.stringify(updateData.advanced_settings, null, 2));
      }
      
      // Handle general settings - comprehensive approach
      const newGeneralSettings: GeneralSettings = {
        ...(fieldData.general_settings || {}),
      };

      // Extract all possible fields that should go into general_settings
      if (fieldData.helpText !== undefined || 
          fieldData.settings?.helpText !== undefined || 
          fieldData.settings?.ui_options?.help_text !== undefined) {
        newGeneralSettings.helpText = fieldData.helpText || 
                                    fieldData.settings?.helpText || 
                                    fieldData.settings?.ui_options?.help_text;
      }
      
      if (fieldData.placeholder !== undefined ||
          fieldData.settings?.ui_options?.placeholder !== undefined) {
        newGeneralSettings.placeholder = fieldData.placeholder || 
                                      fieldData.settings?.ui_options?.placeholder;
      }
      
      // Handle hidden_in_forms
      if (fieldData.settings?.ui_options?.hidden_in_forms !== undefined) {
        newGeneralSettings.hidden_in_forms = fieldData.settings.ui_options.hidden_in_forms;
      }
      
      // Handle field type specific settings
      if (fieldData.keyFilter !== undefined) {
        newGeneralSettings.keyFilter = fieldData.keyFilter;
      }
      
      if (fieldData.min !== undefined) {
        newGeneralSettings.minValue = fieldData.min;
      }
      
      if (fieldData.max !== undefined) {
        newGeneralSettings.maxValue = fieldData.max;
      }
      
      if (fieldData.length !== undefined) {
        newGeneralSettings.otpLength = fieldData.length;
      }
      
      if (fieldData.maxTags !== undefined) {
        newGeneralSettings.maxTags = fieldData.maxTags;
      }
      
      if (fieldData.prefix !== undefined) {
        newGeneralSettings.prefix = fieldData.prefix;
      }
      
      if (fieldData.suffix !== undefined) {
        newGeneralSettings.suffix = fieldData.suffix;
      }
      
      if (fieldData.rows !== undefined) {
        newGeneralSettings.rows = fieldData.rows;
      }
      
      if (fieldData.minHeight !== undefined) {
        newGeneralSettings.minHeight = fieldData.minHeight;
      }
      
      // Only merge if we have new general settings to add
      if (Object.keys(newGeneralSettings).length > 0) {
        const currentGeneralSettings = currentFieldExtended.general_settings || {};
        updateData.general_settings = deepMerge(currentGeneralSettings, newGeneralSettings);
        debugLog('[updateField] New general settings:', JSON.stringify(updateData.general_settings, null, 2));
      }
      
      // Legacy settings structure - keep it for backward compatibility
      if (fieldData.settings || Object.keys(newGeneralSettings).length > 0) {
        // Copy the existing settings object to avoid reference issues
        const currentSettings = currentFieldExtended?.settings ? JSON.parse(JSON.stringify(currentFieldExtended.settings)) : {};
        
        // Create a settings update object
        const settingsUpdate = {...(fieldData.settings || {})};
        
        // Ensure ui_options exists
        if (!settingsUpdate.ui_options) {
          settingsUpdate.ui_options = {};
        }
        
        // Add general settings fields to ui_options for backward compatibility
        if (newGeneralSettings.placeholder !== undefined) {
          settingsUpdate.ui_options.placeholder = newGeneralSettings.placeholder;
        }
        
        if (newGeneralSettings.helpText !== undefined) {
          settingsUpdate.ui_options.help_text = newGeneralSettings.helpText;
          settingsUpdate.helpText = newGeneralSettings.helpText;
        }
        
        if (newGeneralSettings.hidden_in_forms !== undefined) {
          settingsUpdate.ui_options.hidden_in_forms = newGeneralSettings.hidden_in_forms;
        }
        
        // Deep merge settings
        const mergedSettings = deepMerge(currentSettings, settingsUpdate);
        
        updateData.settings = mergedSettings;
        
        debugLog('[updateField] Merged legacy settings:', JSON.stringify(mergedSettings, null, 2));
      }
      
      debugLog('[updateField] Final update data:', JSON.stringify(updateData, null, 2));
      
      // Update the field in the database
      const { data, error } = await supabase
        .from('fields')
        .update(updateData)
        .eq('id', fieldId)
        .select()
        .single();

      if (error) {
        console.error('Error updating field:', error);
        toast({
          title: "Error updating field",
          description: `Database error: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }

      // Map the database response to our field model
      const mappedField = mapSupabaseField(data);
      
      // Log the mapped field for debugging
      debugLog('[updateField] Updated field after mapping:', JSON.stringify(mappedField, null, 2));
      
      toast({
        title: "Field updated",
        description: `The field "${mappedField.name}" was successfully updated`,
      });
      
      return mappedField;
    } catch (error: any) {
      console.error('Failed to update field:', error);
      toast({
        title: "Field update failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      throw error;
    }
  },

  deleteField: async (collectionId: string, fieldId: string): Promise<{ success: boolean }> => {
    debugLog(`Deleting field ${fieldId} from collection ${collectionId}`);
    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', fieldId);

      if (error) {
        console.error('Error deleting field:', error);
        toast({
          title: "Error deleting field",
          description: `Database error: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Field deleted",
        description: "The field was successfully deleted",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete field:', error);
      toast({
        title: "Field deletion failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      return { success: false };
    }
  },

  updateFieldOrder: async (collectionId: string, fieldOrders: { id: string, sort_order: number }[]): Promise<boolean> => {
    try {
      // Update each field's sort_order in sequence
      for (const field of fieldOrders) {
        const { error } = await supabase
          .from('fields')
          .update({ sort_order: field.sort_order })
          .eq('id', field.id)
          .eq('collection_id', collectionId);

        if (error) {
          console.error(`Error updating field order for ${field.id}:`, error);
          throw error;
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to update field order:', error);
      return false;
    }
  },

  fetchCollections: async (): Promise<Collection[]> => {
    try {
      const { data: collections, error } = await supabase
        .from('collections')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching collections:', error);
        throw error;
      }

      const mappedCollections = collections.map(mapSupabaseCollection);

      for (const collection of mappedCollections) {
        try {
          const { count: fieldCount, error: fieldsError } = await supabase
            .from('fields')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          if (!fieldsError) {
            collection.fields = new Array(fieldCount || 0);
          }

          const { count: itemCount, error: itemsError } = await supabase
            .from('content_items')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          if (!itemsError) {
            collection.items = itemCount || 0;
          }
        } catch (countError) {
          console.error(`Error counting related data for collection ${collection.id}:`, countError);
        }
      }

      return mappedCollections;
    } catch (error) {
      console.error('Failed to fetch collections:', error);

      return [
        {
          id: 'col1',
          title: 'Blog Posts',
          apiId: 'blog_posts',
          description: 'Collection of blog posts',
          status: 'published',
          fields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          icon: 'file-text',
          iconColor: 'blue',
          items: 5,
          lastUpdated: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'col2',
          title: 'Products',
          apiId: 'products',
          description: 'Collection of products',
          status: 'published',
          fields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          icon: 'shopping-bag',
          iconColor: 'green',
          items: 12,
          lastUpdated: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  },

  createCollection: async (collectionData: CollectionFormData): Promise<Collection> => {
    try {
      const newCollection = {
        title: collectionData.name,
        api_id: collectionData.apiId,
        description: collectionData.description || null,
        status: collectionData.status || 'draft',
        icon: 'file',
        icon_color: 'gray',
      };

      const { data, error } = await supabase
        .from('collections')
        .insert([newCollection])
        .select()
        .single();

      if (error) {
        console.error('Error creating collection:', error);
        throw error;
      }

      return mapSupabaseCollection(data);
    } catch (error) {
      console.error('Failed to create collection:', error);

      return {
        id: `col-${Date.now()}`,
        title: collectionData.name,
        apiId: collectionData.apiId,
        description: collectionData.description,
        status: collectionData.status || 'draft',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        icon: 'file',
        iconColor: 'gray',
        items: 0,
        lastUpdated: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  },

  getContentItems: async (collectionId: string): Promise<any[]> => {
    try {
      const { data: contentItems, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('collection_id', collectionId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching content items:', error);
        throw error;
      }

      return contentItems;
    } catch (error) {
      console.error('Failed to fetch content items:', error);

      return [
        {
          id: `item-${Date.now()}-1`,
          collection_id: collectionId,
          data: { title: 'Test Item 1' },
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: `item-${Date.now()}-2`,
          collection_id: collectionId,
          data: { title: 'Test Item 2' },
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  }
};

export const {
  getFieldsForCollection,
  createField,
  updateField,
  deleteField,
  updateFieldOrder,
  fetchCollections,
  createCollection,
  getContentItems
} = CollectionService;
