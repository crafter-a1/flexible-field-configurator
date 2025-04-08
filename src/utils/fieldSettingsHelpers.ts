
// Add general settings to the FieldSettings interface
export interface FieldSettings {
  validation: ValidationSettings;
  appearance: AppearanceSettings;
  advanced: AdvancedSettings;
  ui_options: UIOptions;
  general: GeneralSettings;
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
