import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GeneralSettings } from '@/utils/fieldSettingsHelpers';

interface FieldConfigTabProps {
  fieldType: string | null;
  fieldData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

interface FieldConfigData {
  name: string;
  apiId: string;
  description: string;
  required: boolean;
  type: string | null;
  general_settings: GeneralSettings;
  helpText: string;
  placeholder: string;
  keyFilter: string;
  ui_options: {
    placeholder: string;
    help_text: string;
    hidden_in_forms: boolean;
    [key: string]: any;
  };
  [key: string]: any;
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
      setName(fieldData.name || '');
      setApiId(fieldData.apiId || '');
      setDescription(fieldData.description || '');
      setRequired(fieldData.required || false);
      
      const generalSettings: GeneralSettings = fieldData.general_settings || {};
      const uiOptions = fieldData.settings?.ui_options || fieldData.ui_options || {};
      
      setPlaceholder(generalSettings.placeholder || uiOptions.placeholder || '');
      setHelpText(generalSettings.helpText || fieldData.helpText || uiOptions.help_text || '');
      setHiddenInForms(generalSettings.hidden_in_forms !== undefined ? generalSettings.hidden_in_forms : uiOptions.hidden_in_forms || false);
      setKeyFilter(generalSettings.keyFilter || fieldData.keyFilter || 'none');
      
      setMinValue(generalSettings.minValue !== undefined ? generalSettings.minValue : 
                 generalSettings.min !== undefined ? generalSettings.min : 
                 fieldData.min);
      
      setMaxValue(generalSettings.maxValue !== undefined ? generalSettings.maxValue : 
                 generalSettings.max !== undefined ? generalSettings.max : 
                 fieldData.max);
      
      setOtpLength(generalSettings.otpLength !== undefined ? generalSettings.otpLength : 
                  generalSettings.length !== undefined ? generalSettings.length : 
                  fieldData.length || 6);
      
      setMaxTags(generalSettings.maxTags !== undefined ? generalSettings.maxTags : fieldData.maxTags || 10);
      setPrefix(generalSettings.prefix || fieldData.prefix || '');
      setSuffix(generalSettings.suffix || fieldData.suffix || '');
      setRows(generalSettings.rows !== undefined ? generalSettings.rows : fieldData.rows || 5);
      setMinHeight(generalSettings.minHeight || fieldData.minHeight || '200px');
    } else if (fieldType) {
      const typeLabel = fieldType.charAt(0).toUpperCase() + fieldType.slice(1);
      setName(`New ${typeLabel} Field`);
      setApiId(`new_${fieldType}_field`);
      setPlaceholder(`Enter ${typeLabel}...`);
    }
  }, [fieldData, fieldType]);

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
    
    const generalSettings: GeneralSettings = {
      placeholder,
      helpText,
      hidden_in_forms: hiddenInForms,
      keyFilter,
      ui_options: {
        placeholder,
        help_text: helpText,
        hidden_in_forms: hiddenInForms,
        width: 100,
        showCharCount: false
      }
    };
    
    if (fieldType === 'number') {
      generalSettings.minValue = minValue;
      generalSettings.maxValue = maxValue;
      generalSettings.min = minValue;
      generalSettings.max = maxValue;
    } else if (fieldType === 'otp') {
      generalSettings.otpLength = otpLength;
      generalSettings.length = otpLength;
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
    
    console.log('Saving field with general settings:', JSON.stringify(generalSettings, null, 2));
    
    const fieldConfigData: FieldConfigData = {
      name,
      apiId,
      description,
      required,
      type: fieldType,
      general_settings: generalSettings,
      helpText,
      placeholder,
      keyFilter,
      ui_options: {
        placeholder,
        help_text: helpText,
        hidden_in_forms: hiddenInForms
      }
    };
    
    if (fieldType === 'number') {
      fieldConfigData.min = minValue;
      fieldConfigData.max = maxValue;
    } else if (fieldType === 'otp') {
      fieldConfigData.length = otpLength;
    } else if (fieldType === 'tags') {
      fieldConfigData.maxTags = maxTags;
    } else if (fieldType === 'slug') {
      fieldConfigData.prefix = prefix;
      fieldConfigData.suffix = suffix;
    } else if (fieldType === 'textarea' || fieldType === 'markdown') {
      fieldConfigData.rows = rows;
    } else if (fieldType === 'blockeditor' || fieldType === 'wysiwyg') {
      fieldConfigData.minHeight = minHeight;
    }
    
    onSave(fieldConfigData);
  };

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
          disabled={isSaving}
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
