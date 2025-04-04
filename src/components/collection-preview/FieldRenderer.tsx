
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateCalendarField } from '@/components/fields/inputs/DateCalendarField';
import { InputTextField } from '@/components/fields/inputs/InputTextField';
import { NumberInputField } from '@/components/fields/inputs/NumberInputField';
import { SelectButtonField } from '@/components/form-fields/SelectButtonField';
import { PasswordInputField } from '@/components/fields/inputs/PasswordInputField';
import { MaskInputField } from '@/components/fields/inputs/MaskInputField';
import { OTPInputField } from '@/components/fields/inputs/OTPInputField';
import { AutocompleteInputField } from '@/components/fields/inputs/AutocompleteInputField';
import { BlockEditorField } from '@/components/fields/inputs/BlockEditorField';
import { WysiwygEditorField } from '@/components/fields/inputs/WysiwygEditorField';
import { MarkdownEditorField } from '@/components/fields/inputs/MarkdownEditorField';
import { TagsInputField } from '@/components/fields/inputs/TagsInputField';
import { SlugInputField } from '@/components/fields/inputs/SlugInputField';
import { ColorPickerField } from '@/components/fields/inputs/ColorPickerField';
import { RadioCardsField } from '@/components/fields/inputs/RadioCardsField';
import { CheckboxCardsField } from '@/components/fields/inputs/CheckboxCardsField';
import { FileInputField } from '@/components/fields/inputs/FileInputField';
import { MultiFileInputField } from '@/components/fields/inputs/MultiFileInputField';
import { JSONEditorField } from '@/components/fields/inputs/JSONEditorField';
import { RatingField } from '@/components/fields/inputs/RatingField';
import { SliderField } from '@/components/fields/inputs/SliderField';

interface FieldRendererProps {
  field: any;
  formData: Record<string, any>;
  titleField: string | null;
  onInputChange: (fieldId: string, value: any) => void;
}

export function FieldRenderer({ field, formData, titleField, onInputChange }: FieldRendererProps) {
  const commonProps = {
    id: field.api_id,
    label: field.name,
    value: formData[field.api_id],
    onChange: (value: any) => onInputChange(field.api_id, value),
    required: field.required || false,
    helpText: field.helpText || null,
    className: "mb-5",
  };

  switch (field.type) {
    case 'text':
      return (
        <InputTextField
          {...commonProps}
          placeholder={field.placeholder || `Enter ${field.name}`}
          keyFilter={field.keyFilter || "none"}
          floatLabel={field.appearance?.floatLabel}
          filled={field.appearance?.filled}
        />
      );
    case 'textarea':
      return (
        <div className="mb-5">
          <Label htmlFor={field.api_id}>{field.name}{field.required && <span className="text-red-500 ml-1">*</span>}</Label>
          <Textarea
            id={field.api_id}
            value={formData[field.api_id] || ''}
            onChange={(e) => onInputChange(field.api_id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.name}`}
            required={field.required}
            className="mt-1"
            rows={5}
          />
          {field.helpText && (
            <p className="text-muted-foreground text-xs mt-1">{field.helpText}</p>
          )}
        </div>
      );
    case 'number':
      return (
        <NumberInputField
          {...commonProps}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder || `Enter a number`}
          floatLabel={field.appearance?.floatLabel}
          filled={field.appearance?.filled}
          showButtons={field.advanced?.showButtons}
          buttonLayout={field.advanced?.buttonLayout || "horizontal"}
          prefix={field.advanced?.prefix}
          suffix={field.advanced?.suffix}
        />
      );
    case 'boolean':
    case 'toggle':
      return (
        <div key={field.id} className="flex items-center space-x-2 mb-5">
          <Switch
            id={field.api_id}
            checked={formData[field.api_id] || false}
            onCheckedChange={(checked) => onInputChange(field.api_id, checked)}
          />
          <Label htmlFor={field.api_id}>{field.name}{field.required && <span className="text-red-500 ml-1">*</span>}</Label>
        </div>
      );
    case 'select':
      return (
        <div className="mb-5">
          <Label htmlFor={field.api_id}>{field.name}{field.required && <span className="text-red-500 ml-1">*</span>}</Label>
          <Select 
            onValueChange={(value) => onInputChange(field.api_id, value)}
            defaultValue={formData[field.api_id] || ''}
          >
            <SelectTrigger id={field.api_id} className="mt-1">
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options &&
                field.options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {field.helpText && (
            <p className="text-muted-foreground text-xs mt-1">{field.helpText}</p>
          )}
        </div>
      );
    case 'selectbutton':
      return (
        <SelectButtonField
          {...commonProps}
          options={field.options}
          value={formData[field.api_id] || ''}
        />
      );
    case 'date':
      return (
        <DateCalendarField
          {...commonProps}
          value={formData[field.api_id] || null}
          onChange={(date: Date) => {
            onInputChange(field.api_id, date);
          }}
        />
      );
    case 'password':
      return (
        <PasswordInputField
          {...commonProps}
          placeholder={field.placeholder || `Enter password`}
          floatLabel={field.appearance?.floatLabel}
          filled={field.appearance?.filled}
        />
      );
    case 'mask':
      return (
        <MaskInputField
          {...commonProps}
          placeholder={field.placeholder || `Enter value`}
          mask={field.mask || ''}
          floatLabel={field.appearance?.floatLabel}
          filled={field.appearance?.filled}
        />
      );
    case 'otp':
      return (
        <OTPInputField
          {...commonProps}
          length={field.length || 6}
        />
      );
    case 'autocomplete':
      return (
        <AutocompleteInputField
          {...commonProps}
          placeholder={field.placeholder || `Type to search...`}
          options={field.options || []}
          floatLabel={field.appearance?.floatLabel}
          filled={field.appearance?.filled}
        />
      );
    case 'blockeditor':
      return (
        <BlockEditorField
          {...commonProps}
          placeholder={field.placeholder || `Enter content...`}
          minHeight={field.minHeight || '200px'}
        />
      );
    case 'wysiwyg':
      return (
        <WysiwygEditorField
          {...commonProps}
          placeholder={field.placeholder || `Enter content...`}
          minHeight={field.minHeight || '200px'}
        />
      );
    case 'markdown':
      return (
        <MarkdownEditorField
          {...commonProps}
          placeholder={field.placeholder || `Enter markdown content...`}
          rows={field.rows || 10}
        />
      );
    case 'tags':
      return (
        <TagsInputField
          {...commonProps}
          value={formData[field.api_id] || []}
          placeholder={field.placeholder || `Add tags...`}
          maxTags={field.maxTags || 10}
        />
      );
    case 'slug':
      return (
        <SlugInputField
          {...commonProps}
          placeholder={field.placeholder || `url-friendly-slug`}
          sourceValue={titleField ? formData[titleField] : ''}
          prefix={field.prefix || ''}
          suffix={field.suffix || ''}
        />
      );
    case 'color':
    case 'colorpicker':
      return (
        <ColorPickerField
          {...commonProps}
          placeholder={field.placeholder || `Select color`}
          showAlpha={field.advanced?.showAlpha}
        />
      );
    case 'radioCards':
      return (
        <RadioCardsField
          {...commonProps}
          options={field.options || []}
        />
      );
    case 'checkboxCards':
      return (
        <CheckboxCardsField
          {...commonProps}
          value={formData[field.api_id] || []}
          options={field.options || []}
          maxSelections={field.maxSelections}
        />
      );
    case 'file':
      return (
        <FileInputField
          {...commonProps}
          value={formData[field.api_id] || null}
          accept={field.accept}
          maxSize={field.maxSize || 10}
          showPreview={field.showPreview !== false}
        />
      );
    case 'files':
      return (
        <MultiFileInputField
          {...commonProps}
          value={formData[field.api_id] || []}
          accept={field.accept}
          maxSize={field.maxSize || 10}
          maxFiles={field.maxFiles || 5}
          showPreviews={field.showPreviews !== false}
        />
      );
    case 'json':
      return (
        <JSONEditorField
          {...commonProps}
          value={formData[field.api_id] || {}}
          rows={field.rows || 10}
        />
      );
    case 'rating':
      return (
        <RatingField
          {...commonProps}
          value={formData[field.api_id] || 0}
          maxRating={field.maxRating || 5}
          allowHalf={field.allowHalf}
          size={field.size || 'md'}
        />
      );
    case 'slider':
      return (
        <SliderField
          {...commonProps}
          value={formData[field.api_id] || 0}
          min={field.min || 0}
          max={field.max || 100}
          step={field.step || 1}
          showInput={field.showInput !== false}
          showMarks={field.advanced?.showMarks}
          markStep={field.advanced?.markStep}
        />
      );
    default:
      return <div key={field.id}>Unknown field type: {field.type}</div>;
  }
}
