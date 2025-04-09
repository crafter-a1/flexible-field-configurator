
import React from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';
import { GeneralSettings } from '@/utils/fieldSettingsHelpers';

interface GeneralSettingsMiddlewareProps {
  children: (props: {
    settings: GeneralSettings;
    updateSettings: (settings: GeneralSettings) => Promise<void>;
    saveToDatabase: (settings: GeneralSettings) => Promise<void>;
    isSaving: boolean;
  }) => React.ReactNode;
}

/**
 * Middleware component for general settings
 * Provides general settings and update methods to children
 */
export function GeneralSettingsMiddleware({
  children
}: GeneralSettingsMiddlewareProps) {
  const { fieldData, saveToDatabase, isSaving } = useFieldSettings();
  
  // Extract general settings from fieldData
  const generalSettings = fieldData?.general_settings || {};
  
  // Create update method for general settings
  const updateGeneralSettings = async (settings: GeneralSettings) => {
    console.log('Updating general settings:', settings);
    
    // Make sure all properties are preserved
    const updatedSettings = {
      ...generalSettings, // Keep all existing settings
      ...settings, // Apply new settings
      // Ensure UI options are also updated for compatibility
      ui_options: {
        ...(generalSettings.ui_options || {}),
        ...(settings.ui_options || {}),
        placeholder: settings.placeholder !== undefined ? settings.placeholder : generalSettings.placeholder,
        help_text: settings.helpText !== undefined ? settings.helpText : generalSettings.helpText,
        hidden_in_forms: settings.hidden_in_forms !== undefined ? settings.hidden_in_forms : generalSettings.hidden_in_forms,
      }
    };
    
    return saveToDatabase('general', updatedSettings);
  };
  
  // Create a specialized save function for general settings
  const saveGeneralToDatabase = async (settings: GeneralSettings) => {
    console.log('Saving general settings to database:', settings);
    
    // Make sure all properties are preserved
    const updatedSettings = {
      ...generalSettings, // Keep all existing settings
      ...settings, // Apply new settings
      // Ensure UI options are also updated for compatibility
      ui_options: {
        ...(generalSettings.ui_options || {}),
        ...(settings.ui_options || {}),
        placeholder: settings.placeholder !== undefined ? settings.placeholder : generalSettings.placeholder,
        help_text: settings.helpText !== undefined ? settings.helpText : generalSettings.helpText,
        hidden_in_forms: settings.hidden_in_forms !== undefined ? settings.hidden_in_forms : generalSettings.hidden_in_forms,
      }
    };
    
    return saveToDatabase('general', updatedSettings);
  };
  
  return (
    <>
      {children({
        settings: generalSettings,
        updateSettings: updateGeneralSettings,
        saveToDatabase: saveGeneralToDatabase,
        isSaving
      })}
    </>
  );
}
