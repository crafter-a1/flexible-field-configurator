
import React from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';
import { ValidationSettings } from '@/utils/fieldSettingsHelpers';
import { toast } from '@/hooks/use-toast';

interface ValidationSettingsMiddlewareProps {
  children: (props: {
    settings: ValidationSettings;
    updateSettings: (settings: ValidationSettings) => Promise<void>;
    saveToDatabase: (settings: ValidationSettings) => Promise<void>;
    isSaving: boolean;
  }) => React.ReactNode;
}

/**
 * Middleware component for validation settings
 * Provides validation settings and update methods to children
 */
export function ValidationSettingsMiddleware({
  children
}: ValidationSettingsMiddlewareProps) {
  const { validation, updateValidation, saveToDatabase, isSaving } = useFieldSettings();
  
  // Create a specialized update function for validation settings that does a deep merge
  const updateSettings = async (newSettings: ValidationSettings) => {
    // Deep merge the new settings with existing settings
    const mergedSettings = {
      ...validation,
      ...newSettings,
    };
    
    console.log('ValidationSettingsMiddleware - Merging settings:', {
      existing: validation,
      new: newSettings,
      merged: mergedSettings
    });
    
    return updateValidation(mergedSettings);
  };
  
  // Create a specialized save function for validation settings
  const saveValidationToDatabase = async (settings: ValidationSettings) => {
    try {
      console.log('ValidationSettingsMiddleware - Saving to database:', settings);
      await saveToDatabase('validation', settings);
      
      toast({
        title: "Validation settings saved",
        description: "Your validation settings have been successfully saved."
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving validation settings:', error);
      
      toast({
        title: "Error saving validation settings",
        description: "There was a problem saving your validation settings.",
        variant: "destructive"
      });
      
      return Promise.reject(error);
    }
  };
  
  return (
    <>
      {children({
        settings: validation,
        updateSettings,
        saveToDatabase: saveValidationToDatabase,
        isSaving
      })}
    </>
  );
}
