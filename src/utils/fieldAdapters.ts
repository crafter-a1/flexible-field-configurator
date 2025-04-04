export function adaptCollectionFormData(values: any): any {
  const adaptedFields = values.fields.map((field: any) => {
    let settings = field.settings || {};

    // Adapt number field settings
    if (field.type === 'number') {
      settings = adaptNumberFieldSettings(field.settings);
    }

    return {
      name: field.name,
      api_id: field.apiId,
      type: field.type,
      required: field.required || false,
      settings: settings,
    };
  });

  return {
    name: values.name,
    api_id: values.apiId,
    description: values.description,
    status: values.status,
    fields: adaptedFields,
  };
}

export function adaptNumberFieldSettings(settings: any): any {
  const adaptedSettings: any = {};

  if (settings.min !== undefined) {
    adaptedSettings.min = settings.min;
  }
  if (settings.max !== undefined) {
    adaptedSettings.max = settings.max;
  }
  if (settings.step !== undefined) {
    adaptedSettings.step = settings.step;
  }
  if (settings.defaultValue !== undefined) {
    adaptedSettings.defaultValue = settings.defaultValue;
  }
  if (settings.prefix !== undefined) {
    adaptedSettings.prefix = settings.prefix;
  }
  if (settings.suffix !== undefined) {
    adaptedSettings.suffix = settings.suffix;
  }
  if (settings.locale !== undefined) {
    adaptedSettings.locale = settings.locale;
  }
  if (settings.currency !== undefined) {
    adaptedSettings.currency = settings.currency;
  }
  if (settings.showButtons !== undefined) {
    adaptedSettings.showButtons = settings.showButtons;
  }
  if (settings.buttonLayout !== undefined) {
    adaptedSettings.buttonLayout = settings.buttonLayout;
  }
  if (settings.floatLabel !== undefined) {
    adaptedSettings.floatLabel = settings.floatLabel;
  }
  if (settings.filled !== undefined) {
    adaptedSettings.filled = settings.filled;
  }
  if (settings.accessibilityLabel !== undefined) {
    adaptedSettings.accessibilityLabel = settings.accessibilityLabel;
  }

  return adaptedSettings;
}

export function adaptFieldsForPreview(fields: any[]): any[] {
  return fields.map(field => {
    const apiId = field.api_id || field.apiId || field.name?.toLowerCase().replace(/\s+/g, '_');
    
    return {
      id: field.id,
      name: field.name,
      type: field.type,
      apiId: apiId,
      required: field.required || false,
      helpText: field.helpText || field.description,
      placeholder: field.ui_options?.placeholder || field.placeholder,
      validation: field.validation || {},
      appearance: field.appearance || {},
      advanced: field.advanced || {},
      options: field.options || [],
      min: field.min !== undefined ? field.min : (field.validation?.min !== undefined ? field.validation.min : undefined),
      max: field.max !== undefined ? field.max : (field.validation?.max !== undefined ? field.validation.max : undefined),
      maxTags: field.maxTags || 10,
      mask: field.mask || field.advanced?.mask,
      keyFilter: field.keyFilter || field.validation?.keyFilter,
      length: field.length || 6,  // For OTP input
      rows: field.rows || 10,     // For textarea/markdown
      prefix: field.prefix || field.advanced?.prefix,
      suffix: field.suffix || field.advanced?.suffix,
    };
  });
}
