
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { ValidationSettings } from '@/services/CollectionService';

export interface FieldValidationPanelProps {
  fieldType: string | null;
  initialData?: ValidationSettings;
  onUpdate: (settings: ValidationSettings) => void;
  onSave?: (section: string, settings: any) => Promise<void>;
  isSaving?: boolean;
}

export function FieldValidationPanel({
  fieldType,
  initialData = {},
  onUpdate,
  onSave,
  isSaving
}: FieldValidationPanelProps) {
  const [settings, setSettings] = React.useState<ValidationSettings>(initialData);

  React.useEffect(() => {
    setSettings(initialData);
  }, [initialData]);

  const handleSettingChange = (key: string, value: any) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    onUpdate(updatedSettings);
  };

  const renderFieldTypeSpecificValidation = () => {
    switch (fieldType) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="min-length">Minimum Length</Label>
                <p className="text-sm text-muted-foreground">Minimum number of characters</p>
              </div>
              <Input
                id="min-length"
                type="number"
                className="w-20"
                value={settings.minLength || ''}
                onChange={(e) => handleSettingChange('minLength', parseInt(e.target.value) || '')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="max-length">Maximum Length</Label>
                <p className="text-sm text-muted-foreground">Maximum number of characters</p>
              </div>
              <Input
                id="max-length"
                type="number"
                className="w-20"
                value={settings.maxLength || ''}
                onChange={(e) => handleSettingChange('maxLength', parseInt(e.target.value) || '')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pattern">Pattern (Regex)</Label>
                <p className="text-sm text-muted-foreground">Validate using regular expression</p>
              </div>
              <Input
                id="pattern"
                className="w-48"
                value={settings.pattern || ''}
                onChange={(e) => handleSettingChange('pattern', e.target.value)}
              />
            </div>
          </div>
        );
      case 'number':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="min-value">Minimum Value</Label>
                <p className="text-sm text-muted-foreground">Minimum allowed value</p>
              </div>
              <Input
                id="min-value"
                type="number"
                className="w-20"
                value={settings.min || ''}
                onChange={(e) => handleSettingChange('min', parseInt(e.target.value) || '')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="max-value">Maximum Value</Label>
                <p className="text-sm text-muted-foreground">Maximum allowed value</p>
              </div>
              <Input
                id="max-value"
                type="number"
                className="w-20"
                value={settings.max || ''}
                onChange={(e) => handleSettingChange('max', parseInt(e.target.value) || '')}
              />
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Domain Validation</Label>
                <p className="text-sm text-muted-foreground">Limit emails to specific domains</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="domain-validation"
                  checked={settings.domainValidation || false}
                  onCheckedChange={(checked) => handleSettingChange('domainValidation', checked)}
                />
                <Label htmlFor="domain-validation">Enable</Label>
              </div>
            </div>
            {settings.domainValidation && (
              <div className="space-y-2">
                <Label htmlFor="allowed-domains">Allowed Domains</Label>
                <Input
                  id="allowed-domains"
                  placeholder="example.com, domain.org"
                  value={settings.allowedDomains || ''}
                  onChange={(e) => handleSettingChange('allowedDomains', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Comma-separated list of allowed domains</p>
              </div>
            )}
          </div>
        );
      case 'url':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>HTTPS Only</Label>
                <p className="text-sm text-muted-foreground">Only allow HTTPS URLs</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="https-only"
                  checked={settings.httpsOnly || false}
                  onCheckedChange={(checked) => handleSettingChange('httpsOnly', checked)}
                />
                <Label htmlFor="https-only">Enable</Label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-4">
          {renderFieldTypeSpecificValidation()}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Custom Error Message</Label>
                <p className="text-sm text-muted-foreground">Show this message when validation fails</p>
              </div>
              <Input
                id="error-message"
                className="w-48"
                value={settings.errorMessage || ''}
                onChange={(e) => handleSettingChange('errorMessage', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {onSave && (
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => onSave('validation', settings)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Validation Settings
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
