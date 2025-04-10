
import { supabase } from '@/integrations/supabase/client';
import { getFieldsForCollection } from './CollectionService';
import { adaptFieldsForPreview } from '@/utils/fieldAdapters';

/**
 * Service for handling API operations related to collections
 */
export const CollectionApiService = {
  /**
   * Get all fields for a collection formatted for external rendering
   * 
   * @param collectionId - The ID of the collection
   * @param includeAppearance - Whether to include appearance settings (default: true)
   * @param includeValidation - Whether to include validation settings (default: true)
   */
  getCollectionFields: async (
    collectionId: string,
    includeAppearance = true,
    includeValidation = true
  ) => {
    try {
      console.log(`[CollectionApiService] Fetching fields for collection ${collectionId}`);
      
      // Get fields using existing service
      const fields = await getFieldsForCollection(collectionId);
      
      // Adapt fields for preview (this ensures proper structure)
      const adaptedFields = adaptFieldsForPreview(fields);
      
      // Filter out sensitive or unnecessary data
      const apiFields = adaptedFields.map(field => {
        const apiField: any = {
          id: field.id,
          name: field.name,
          apiId: field.apiId || field.api_id,
          type: field.type,
          description: field.description,
          required: field.required,
          
          // Always include general settings
          general_settings: field.general_settings || {},
        };
        
        // Add helpText from the most specific location
        apiField.helpText = field.general_settings?.helpText || 
                           field.helpText || 
                           field.settings?.helpText || 
                           '';
        
        // Add placeholder from the most specific location
        apiField.placeholder = field.general_settings?.placeholder || 
                              field.placeholder || 
                              field.settings?.ui_options?.placeholder || 
                              '';
        
        // Include appearance settings if requested
        if (includeAppearance) {
          apiField.appearance = field.appearance_settings || field.appearance || {};
        }
        
        // Include validation settings if requested
        if (includeValidation) {
          apiField.validation = field.validation_settings || field.validation || {};
        }
        
        return apiField;
      });
      
      return {
        success: true,
        collectionId,
        fields: apiFields
      };
    } catch (error) {
      console.error('[CollectionApiService] Error fetching collection fields:', error);
      return {
        success: false,
        error: 'Failed to fetch collection fields',
        collectionId
      };
    }
  },

  /**
   * Get collection metadata
   * 
   * @param collectionId - The ID of the collection
   */
  getCollectionMetadata: async (collectionId: string) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('id, title, api_id, description, status')
        .eq('id', collectionId)
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        collection: data
      };
    } catch (error) {
      console.error('[CollectionApiService] Error fetching collection metadata:', error);
      return {
        success: false,
        error: 'Failed to fetch collection metadata',
        collectionId
      };
    }
  }
};

export default CollectionApiService;
