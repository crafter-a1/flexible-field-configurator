
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FieldConfigTabProps {
  fieldType: string | null;
  fieldData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function FieldConfigTab({
  fieldType,
  fieldData,
  onSave,
  onCancel,
  isSaving = false
}: FieldConfigTabProps) {
  const [name, setName] = useState('');
  const [apiId, setApiId] = useState('');
  const [description, setDescription] = useState('');
  const [required, setRequired] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [helpText, setHelpText] = useState('');
  const [hiddenInForms, setHiddenInForms] = useState(false);
  const [keyFilter, setKeyFilter] = useState('none');
  
  // Additional field type specific states
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);
  const [otpLength, setOtpLength] = useState<number | undefined>(6);
  const [maxTags, setMaxTags] = useState<number | undefined>(10);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [rows, setRows] = useState<number | undefined>(5);
  const [minHeight, setMinHeight] = useState('200px');

  useEffect(() => {
    if (fieldData) {
      // Basic field properties
      setName(fieldData.name || '');
      setApiId(fieldData.apiId || '');
      setDescription(fieldData.description || '');
      setRequired(fieldData.required || false);
      
      // Extract settings from the new general_settings structure first, then fallback
      const generalSettings = fieldData.general_settings || {};
      const uiOptions = fieldData.settings?.ui_options || fieldData.ui_options_settings || {};
      
      // Set all general fields from general_settings or fallback locations
      setPlaceholder(generalSettings.placeholder || uiOptions.placeholder || '');
      setHelpText(generalSettings.helpText || fieldData.helpText || uiOptions.help_text || '');
      setHiddenInForms(generalSettings.hidden_in_forms || uiOptions.hidden_in_forms || false);
      setKeyFilter(generalSettings.keyFilter || fieldData.keyFilter || 'none');
      
      // Field type specific settings
      setMinValue(generalSettings.minValue !== undefined ? generalSettings.minValue : fieldData.min);
      setMaxValue(generalSettings.maxValue !== undefined ? generalSettings.maxValue : fieldData.max);
      setOtpLength(generalSettings.otpLength !== undefined ? generalSettings.otpLength : fieldData.length || 6);
      setMaxTags(generalSettings.maxTags !== undefined ? generalSettings.maxTags : fieldData.maxTags || 10);
      setPrefix(generalSettings.prefix || fieldData.prefix || '');
      setSuffix(generalSettings.suffix || fieldData.suffix || '');
      setRows(generalSettings.rows !== undefined ? generalSettings.rows : fieldData.rows || 5);
      setMinHeight(generalSettings.minHeight || fieldData.minHeight || '200px');
    } else if (fieldType) {
      // Generate a default field name based on type
      const typeLabel = fieldType.charAt(0).toUpperCase() + fieldType.slice(1);
      setName(`New ${typeLabel} Field`);
      setApiId(`new_${fieldType}_field`);
      setPlaceholder(`Enter ${typeLabel}...`);
    }
  }, [fieldData, fieldType]);

  // Auto-generate API ID based on name
  useEffect(() => {
    if (!fieldData && name) {
      const generatedApiId = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setApiId(generatedApiId);
    }
  }, [name, fieldData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create comprehensive general_settings object with all fields from the General tab
    const generalSettings = {
      placeholder,
      helpText,
      hidden_in_forms: hiddenInForms,
      keyFilter
    };
    
    // Add field type specific settings to general_settings
    if (fieldType === 'number') {
      generalSettings.minValue = minValue;
      generalSettings.maxValue = maxValue;
    } else if (fieldType === 'otp') {
      generalSettings.otpLength = otpLength;
    } else if (fieldType === 'tags') {
      generalSettings.maxTags = maxTags;
    } else if (fieldType === 'slug') {
      generalSettings.prefix = prefix;
      generalSettings.suffix = suffix;
    } else if (fieldType === 'textarea' || fieldType === 'markdown') {
      generalSettings.rows = rows;
    } else if (fieldType === 'blockeditor' || fieldType === 'wysiwyg') {
      generalSettings.minHeight = minHeight;
    }
    
    console.log('Saving field with data:', {
      name,
      apiId,
      description,
      required,
      general_settings: generalSettings,
      type: fieldType
    });
    
    // Create field data object with general_settings
    const fieldConfigData = {
      name,
      apiId,
      description,
      required,
      type: fieldType,
      general_settings: generalSettings,
      // For backwards compatibility
      helpText,
      ui_options: {
        placeholder,
        hidden_in_forms: hiddenInForms
      }
    };
    
    onSave(fieldConfigData);
  };

  // Render field type specific inputs based on field type
  const renderFieldTypeSpecificInputs = () => {
    switch (fieldType) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor="keyFilter">Key Filter</Label>
            <Select value={keyFilter} onValueChange={setKeyFilter}>
              <SelectTrigger id="keyFilter">
                <SelectValue placeholder="Select key filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="letters">Letters only</SelectItem>
                <SelectItem value="numbers">Numbers only</SelectItem>
                <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Filter key presses to allow only specific characters
            </p>
          </div>
        );
      case 'number':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minValue">Minimum Value</Label>
              <Input 
                id="minValue"
                type="number"
                value={minValue === undefined ? '' : minValue}
                onChange={(e) => setMinValue(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxValue">Maximum Value</Label>
              <Input 
                id="maxValue"
                type="number"
                value={maxValue === undefined ? '' : maxValue}
                onChange={(e) => setMaxValue(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        );
      case 'otp':
        return (
          <div className="space-y-2">
            <Label htmlFor="otpLength">OTP Length</Label>
            <Input 
              id="otpLength"
              type="number"
              min={4}
              max={12}
              value={otpLength || 6}
              onChange={(e) => setOtpLength(Number(e.target.value))}
            />
            <p className="text-sm text-gray-500">
              Number of digits in the OTP input (4-12)
            </p>
          </div>
        );
      case 'tags':
        return (
          <div className="space-y-2">
            <Label htmlFor="maxTags">Maximum Tags</Label>
            <Input 
              id="maxTags"
              type="number"
              min={1}
              value={maxTags || 10}
              onChange={(e) => setMaxTags(Number(e.target.value))}
            />
            <p className="text-sm text-gray-500">
              Maximum number of tags allowed
            </p>
          </div>
        );
      case 'slug':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input 
                id="prefix"
                placeholder="e.g. /blog/"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Text to display before the slug
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Input 
                id="suffix"
                placeholder="e.g. .html"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Text to display after the slug
              </p>
            </div>
          </div>
        );
      case 'markdown':
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor="rows">Default Rows</Label>
            <Input 
              id="rows"
              type="number"
              min={3}
              value={rows || 5}
              onChange={(e) => setRows(Number(e.target.value))}
            />
            <p className="text-sm text-gray-500">
              Initial height of the text area
            </p>
          </div>
        );
      case 'blockeditor':
      case 'wysiwyg':
        return (
          <div className="space-y-2">
            <Label htmlFor="minHeight">Minimum Height</Label>
            <Input 
              id="minHeight"
              placeholder="e.g. 200px"
              value={minHeight}
              onChange={(e) => setMinHeight(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Minimum height of the editor (CSS value)
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Field Label</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter field name"
              required
            />
            <p className="text-sm text-gray-500">
              Display name for this field
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiId">API ID</Label>
            <Input 
              id="apiId" 
              value={apiId} 
              onChange={(e) => setApiId(e.target.value)}
              placeholder="Enter API ID"
              required
            />
            <p className="text-sm text-gray-500">
              Used in API requests and code
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter field description"
            rows={3}
          />
          <p className="text-sm text-gray-500">
            Optional description explaining the purpose of this field
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="placeholder">Placeholder Text</Label>
          <Input
            id="placeholder"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            placeholder="Enter placeholder text"
          />
          <p className="text-sm text-gray-500">
            Hint text displayed when field is empty
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="helpText">Help Text</Label>
          <Input
            id="helpText"
            value={helpText}
            onChange={(e) => setHelpText(e.target.value)}
            placeholder="Enter help text"
          />
          <p className="text-sm text-gray-500">
            Additional guidance shown below the field
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={required}
            onCheckedChange={setRequired}
          />
          <Label htmlFor="required">Required Field</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="hiddenInForms"
            checked={hiddenInForms}
            onCheckedChange={setHiddenInForms}
          />
          <Label htmlFor="hiddenInForms">Hidden Field</Label>
        </div>
        
        {renderFieldTypeSpecificInputs()}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!name || !apiId || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Field'
          )}
        </Button>
      </div>
    </form>
  );
}

export default FieldConfigTab;
