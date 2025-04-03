
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FieldAppearancePanel } from "./FieldAppearancePanel";

// Base schema for all field types
const baseFieldSchema = z.object({
  name: z.string().min(2, {
    message: "Field name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  required: z.boolean().default(false),
  ui_options: z.object({
    placeholder: z.string().optional(),
    help_text: z.string().optional(),
    display_mode: z.string().optional(),
    showCharCount: z.boolean().optional(),
    width: z.number().optional(),
    hidden_in_forms: z.boolean().optional(),
  }).optional().default({}),
});

// Text field specific schema
const textFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    minLength: z.number().int().min(0).optional(),
    maxLength: z.number().int().min(0).optional(),
    placeholder: z.string().optional(),
    defaultValue: z.string().optional(),
  }),
});

// Number field specific schema
const numberFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    defaultValue: z.number().optional(),
    placeholder: z.string().optional(),
  }),
});

// Date field specific schema
const dateFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
    defaultToday: z.boolean().optional(),
    format: z.string().optional(),
  }),
});

// Boolean field specific schema
const booleanFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    defaultValue: z.boolean().optional(),
    labelTrue: z.string().optional(),
    labelFalse: z.string().optional(),
  }),
});

// Select field specific schema
const selectFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).min(1),
    multiple: z.boolean().optional(),
    defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

// Helper function to get the appropriate schema based on field type
const getSchemaForFieldType = (fieldType: string | null) => {
  switch (fieldType) {
    case 'text':
    case 'textarea':
      return textFieldSchema;
    case 'number':
      return numberFieldSchema;
    case 'date':
      return dateFieldSchema;
    case 'boolean':
      return booleanFieldSchema;
    case 'select':
      return selectFieldSchema;
    // Add more field type schemas as needed
    default:
      return baseFieldSchema;
  }
};

interface FieldConfigPanelProps {
  fieldType: string | null;
  fieldData?: any; // Existing field data for editing
  onSave: (fieldData: any) => void;
  onCancel: () => void;
}

export function FieldConfigPanel({ fieldType, fieldData, onSave, onCancel }: FieldConfigPanelProps) {
  const [activeTab, setActiveTab] = useState("general");
  
  // Default values based on field type
  const getDefaultValues = () => {
    const baseDefaults = {
      name: "",
      description: "",
      required: false,
      ui_options: {
        placeholder: "",
        help_text: "",
        display_mode: "default",
        showCharCount: false,
        width: 100,
        hidden_in_forms: false,
      }
    };

    switch(fieldType) {
      case 'text':
      case 'textarea':
        return {
          ...baseDefaults,
          settings: {
            minLength: 0,
            maxLength: 100,
            placeholder: "",
            defaultValue: "",
          }
        };
      case 'number':
        return {
          ...baseDefaults,
          settings: {
            min: 0,
            max: 100,
            step: 1,
            defaultValue: 0,
            placeholder: "Enter a number",
          }
        };
      case 'date':
        return {
          ...baseDefaults,
          settings: {
            minDate: "",
            maxDate: "",
            defaultToday: false,
            format: "yyyy-MM-dd",
          }
        };
      case 'boolean':
        return {
          ...baseDefaults,
          settings: {
            defaultValue: false,
            labelTrue: "Yes",
            labelFalse: "No",
          }
        };
      case 'select':
        return {
          ...baseDefaults,
          settings: {
            options: [{ label: "Option 1", value: "option1" }],
            multiple: false,
            defaultValue: "",
          }
        };
      default:
        return baseDefaults;
    }
  };
  
  // Set up form with the appropriate schema based on field type
  const form = useForm<any>({
    resolver: zodResolver(getSchemaForFieldType(fieldType)),
    defaultValues: fieldData || getDefaultValues(),
  });

  const handleSubmit = (data: any) => {
    onSave(data);
  };

  const renderSpecificSettings = () => {
    if (!fieldType) return null;

    switch (fieldType) {
      case 'text':
      case 'textarea':
        return (
          <>
            <FormField
              control={form.control}
              name="settings.minLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Length</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      value={field.value || 0}
                    />
                  </FormControl>
                  <FormDescription>
                    The minimum number of characters allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.maxLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Length</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      value={field.value || 100}
                    />
                  </FormControl>
                  <FormDescription>
                    The maximum number of characters allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Text shown when the field is empty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.defaultValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Value</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Pre-filled value when creating new content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      case 'number':
        return (
          <>
            <FormField
              control={form.control}
              name="settings.min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Value</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Value</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.step"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Step</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    The increment/decrement step value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      case 'date':
        return (
          <>
            <FormField
              control={form.control}
              name="settings.defaultToday"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Default to today</FormLabel>
                    <FormDescription>
                      Use the current date as default value
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Format</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Format for displaying and storing dates (e.g., yyyy-MM-dd)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      case 'boolean':
        return (
          <>
            <FormField
              control={form.control}
              name="settings.defaultValue"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Default Value</FormLabel>
                    <FormDescription>
                      Initial state of the boolean field
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.labelTrue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>True Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Label for the true/on state
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.labelFalse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>False Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Label for the false/off state
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      // Add more field type specific settings as needed
      
      default:
        return <p className="text-gray-500">No specific settings for this field type</p>;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter field name..." {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name for this field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter description..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Help text explaining this field's purpose
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Required Field</FormLabel>
                    <FormDescription>
                      Make this field mandatory for content creation
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="validation" className="space-y-4">
            {fieldType ? renderSpecificSettings() : (
              <p className="text-gray-500">Please select a field type first</p>
            )}
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <FieldAppearancePanel form={form} fieldType={fieldType} />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <p className="text-gray-500">Advanced settings will be added soon</p>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Save Field
          </Button>
        </div>
      </form>
    </Form>
  );
}
