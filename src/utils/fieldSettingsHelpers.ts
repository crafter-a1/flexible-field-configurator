
// Add general settings to the FieldSettings interface
export interface FieldSettings {
  validation: ValidationSettings;
  appearance: AppearanceSettings;
  advanced: AdvancedSettings;
  ui_options: UIOptions;
  general: GeneralSettings;
}

// Define ValidationSettings interface
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

// Define AppearanceSettings interface
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

// Define AdvancedSettings interface
export interface AdvancedSettings {
  defaultValue?: any;
  generatedValue?: boolean;
  readonly?: boolean;
  visibility?: string;
  conditionalLogic?: any;
  calculated?: boolean;
  calculation?: string;
  transformations?: any[];
  [key: string]: any;
}

// Define UIOptions interface
export interface UIOptions {
  placeholder?: string;
  help_text?: string;
  hidden_in_forms?: boolean;
  [key: string]: any;
}

// Add GeneralSettings interface
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

// Helper functions for getting settings
export function getValidationSettings(fieldData: any): ValidationSettings {
  return fieldData?.validation_settings || fieldData?.validation || fieldData?.settings?.validation || {};
}

export function getAppearanceSettings(fieldData: any): AppearanceSettings {
  return fieldData?.appearance_settings || fieldData?.appearance || fieldData?.settings?.appearance || {};
}

export function getAdvancedSettings(fieldData: any): AdvancedSettings {
  return fieldData?.advanced_settings || fieldData?.advanced || fieldData?.settings?.advanced || {};
}

export function getUIOptions(fieldData: any): UIOptions {
  return fieldData?.ui_options_settings || fieldData?.ui_options || fieldData?.settings?.ui_options || {};
}

// Add function to get general settings
export function getGeneralSettings(fieldData: any): GeneralSettings {
  // First look in new column structure
  if (fieldData?.general_settings) {
    return fieldData.general_settings;
  }
  
  // Fallback to older structures
  const generalSettings: GeneralSettings = {};
  
  // Extract from ui_options
  const uiOptions = fieldData?.settings?.ui_options || fieldData?.ui_options_settings || {};
  if (uiOptions) {
    if (uiOptions.placeholder !== undefined) generalSettings.placeholder = uiOptions.placeholder;
    if (uiOptions.help_text !== undefined) generalSettings.helpText = uiOptions.help_text;
    if (uiOptions.hidden_in_forms !== undefined) generalSettings.hidden_in_forms = uiOptions.hidden_in_forms;
  }
  
  // Extract helpText from root level
  if (fieldData?.helpText !== undefined) {
    generalSettings.helpText = fieldData.helpText;
  }
  
  // Extract field type specific settings
  if (fieldData?.keyFilter) generalSettings.keyFilter = fieldData.keyFilter;
  if (fieldData?.min !== undefined) generalSettings.minValue = fieldData.min;
  if (fieldData?.max !== undefined) generalSettings.maxValue = fieldData.max;
  if (fieldData?.length !== undefined) generalSettings.otpLength = fieldData.length;
  if (fieldData?.maxTags !== undefined) generalSettings.maxTags = fieldData.maxTags;
  if (fieldData?.prefix !== undefined) generalSettings.prefix = fieldData.prefix;
  if (fieldData?.suffix !== undefined) generalSettings.suffix = fieldData.suffix;
  if (fieldData?.rows !== undefined) generalSettings.rows = fieldData.rows;
  if (fieldData?.minHeight !== undefined) generalSettings.minHeight = fieldData.minHeight;
  
  return generalSettings;
}

// Update the createColumnUpdatePayload function to handle general settings
export function createColumnUpdatePayload(section: keyof FieldSettings, settings: any): any {
  switch (section) {
    case 'validation':
      return { validation_settings: settings };
    case 'appearance':
      return { appearance_settings: settings };
    case 'advanced':
      return { advanced_settings: settings };
    case 'ui_options':
      return { ui_options_settings: settings };
    case 'general':
      return { general_settings: settings };
    default:
      return { [`${section}_settings`]: settings };
  }
}

// Helper functions for normalizing fields
export function getNormalizedFieldSettings(fieldData: any): FieldSettings {
  return {
    validation: getValidationSettings(fieldData),
    appearance: getAppearanceSettings(fieldData),
    advanced: getAdvancedSettings(fieldData),
    ui_options: getUIOptions(fieldData),
    general: getGeneralSettings(fieldData)
  };
}

// Dummy functions to satisfy imports in other files
export function prepareFieldForPreview(field: any): any {
  return field;
}

export function standardizeFieldForDatabase(field: any): any {
  return field;
}

export function updateFieldSettings(fieldData: any, section: keyof FieldSettings, settings: any): any {
  const updated = { ...fieldData };
  switch (section) {
    case 'validation':
      updated.validation_settings = settings;
      updated.validation = settings; // For backward compatibility
      break;
    case 'appearance':
      updated.appearance_settings = settings;
      updated.appearance = settings; // For backward compatibility
      break;
    case 'advanced':
      updated.advanced_settings = settings;
      updated.advanced = settings; // For backward compatibility
      break;
    case 'ui_options':
      updated.ui_options_settings = settings;
      updated.ui_options = settings; // For backward compatibility
      break;
    case 'general':
      updated.general_settings = settings;
      break;
    default:
      updated[`${section}_settings`] = settings;
  }
  return updated;
}

// Backward compatibility wrapper for createColumnUpdatePayload
export function createUpdatePayload(section: keyof FieldSettings, settings: any): any {
  return createColumnUpdatePayload(section, settings);
}
