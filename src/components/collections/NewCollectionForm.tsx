
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";
import { CollectionFormData } from '@/services/CollectionService';

const collectionFormSchema = z.object({
  name: z.string().min(2, {
    message: "Collection name must be at least 2 characters.",
  }).max(50),
  description: z.string().optional(),
  collectionType: z.enum(["collection", "single"]).default("collection"),
  apiIdSingular: z.string().min(2, {
    message: "API ID must be at least 2 characters.",
  }).regex(/^[a-z0-9-_]+$/, {
    message: "API ID can only contain lowercase letters, numbers, hyphens, and underscores.",
  }),
  apiIdPlural: z.string().min(2, {
    message: "API ID (plural) must be at least 2 characters.",
  }).regex(/^[a-z0-9-_]+$/, {
    message: "API ID can only contain lowercase letters, numbers, hyphens, and underscores.",
  }),
});

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

const defaultValues: Partial<CollectionFormValues> = {
  name: "",
  description: "",
  collectionType: "collection",
  apiIdSingular: "",
  apiIdPlural: "",
};

interface NewCollectionFormProps {
  onCollectionCreated?: (data: CollectionFormData) => void;
  onClose?: () => void;
}

export function NewCollectionForm({ onCollectionCreated, onClose }: NewCollectionFormProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues,
  });

  function onSubmit(data: CollectionFormValues) {
    if (onCollectionCreated) {
      onCollectionCreated({
        name: data.name,
        apiId: data.apiIdSingular,
        description: data.description,
        settings: {
          type: data.collectionType,
          apiIdPlural: data.apiIdPlural
        }
      });
    }
  }
  
  // Auto-generate API IDs from name
  const generateApiIds = (name: string) => {
    const singularId = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '')
      .substring(0, 50);
      
    // Simple pluralization - not perfect but works for demo
    const pluralId = singularId.endsWith('y') 
      ? `${singularId.slice(0, -1)}ies` 
      : singularId.endsWith('s') 
        ? `${singularId}es` 
        : `${singularId}s`;
    
    return { singularId, pluralId };
  };
  
  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    
    // Only auto-generate if API IDs are empty or match a previous auto-generation
    const currentSingular = form.getValues("apiIdSingular");
    const currentPlural = form.getValues("apiIdPlural");
    const currentName = form.getValues("name");
    
    const { singularId, pluralId } = generateApiIds(name);
    const prevIds = generateApiIds(currentName);
    
    if (!currentSingular || currentSingular === prevIds.singularId) {
      form.setValue("apiIdSingular", singularId);
    }
    
    if (!currentPlural || currentPlural === prevIds.pluralId) {
      form.setValue("apiIdPlural", pluralId);
    }
  };
  
  const handleGenerateFromName = () => {
    const name = form.getValues("name");
    const { singularId, pluralId } = generateApiIds(name);
    form.setValue("apiIdSingular", singularId);
    form.setValue("apiIdPlural", pluralId);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Create Content Type</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
      
      <p className="text-gray-500 mb-6">
        Define a new content structure for your CMS. Content types will be 
        available through the API to create dynamic forms and manage content.
      </p>
      
      <Tabs defaultValue="basic" onValueChange={(value) => setActiveTab(value as "basic" | "advanced")}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="basic" className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="New Collection" 
                        {...field} 
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      A human-readable name for your content type
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
                        placeholder="A new collection type" 
                        className="resize-none min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A helpful description for your content type
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <FormField
                control={form.control}
                name="collectionType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        <FormItem className="flex items-start space-x-3 space-y-0 border rounded-md p-4">
                          <FormControl>
                            <RadioGroupItem value="collection" />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="font-medium">Collection Type</FormLabel>
                            <FormDescription>
                              Best for multiple instances like articles, products, etc.
                            </FormDescription>
                          </div>
                        </FormItem>
                        <FormItem className="flex items-start space-x-3 space-y-0 border rounded-md p-4">
                          <FormControl>
                            <RadioGroupItem value="single" />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="font-medium">Single Type</FormLabel>
                            <FormDescription>
                              Best for single instance like about us, homepage, etc.
                            </FormDescription>
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium">API Settings</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateFromName}
                  >
                    Generate from name
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name="apiIdSingular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API ID (Singular)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. product, article" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The UID is used to generate the API routes and database tables/collections
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiIdPlural"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API ID (Plural)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. products, articles" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Pluralized API ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <div className="flex justify-end space-x-3 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {activeTab === "basic" ? (
                <Button 
                  type="button" 
                  onClick={() => setActiveTab("advanced")}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  Create
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
