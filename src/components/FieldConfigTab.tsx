
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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

  useEffect(() => {
    if (fieldData) {
      setName(fieldData.name || '');
      setApiId(fieldData.apiId || '');
      setDescription(fieldData.description || '');
      setRequired(fieldData.required || false);
      
      // Extract placeholder from general_settings first, then fallback
      const generalSettings = fieldData.general_settings || {};
      const uiOptions = fieldData.settings?.ui_options || fieldData.ui_options_settings || {};
      
      setPlaceholder(generalSettings.placeholder || uiOptions.placeholder || '');
      
      // Extract helpText from general_settings first, then fallback
      setHelpText(generalSettings.helpText || fieldData.helpText || uiOptions.help_text || '');
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
    
    console.log('Saving field with data:', {
      name,
      apiId,
      description,
      required,
      placeholder,
      helpText,
      type: fieldType
    });
    
    // Create field data object with general_settings
    const fieldConfigData = {
      name,
      apiId,
      description,
      required,
      type: fieldType,
      general_settings: {
        placeholder,
        helpText
      }
    };
    
    onSave(fieldConfigData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Field Name</Label>
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
