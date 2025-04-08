
import React from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';

export interface GeneralSettings {
  placeholder?: string;
  helpText?: string;
  hidden_in_forms?: boolean;
  keyFilter?: string;
  minValue?: number;
  maxValue?: number;
  otpLength?: number;
  maxTags?: number;
  prefix?: string;
  suffix?: string;
  rows?: number;
  minHeight?: string;
  [key: string]: any;
}

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
    return saveToDatabase('general', settings);
  };
  
  // Create a specialized save function for general settings
  const saveGeneralToDatabase = async (settings: GeneralSettings) => {
    console.log('Saving general settings to database:', settings);
    return saveToDatabase('general', settings);
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
