
import { useState, useRef } from 'react';
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { CirclePlus, Plus, ArrowRight, Save, X, Upload } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';
import { CollectionFormData } from '@/services/CollectionService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const collectionFormSchema = z.object({
  name: z.string().min(2, {
    message: "Collection name must be at least 2 characters.",
  }).max(50),
  apiId: z.string().min(2, {
    message: "API ID must be at least 2 characters.",
  }).regex(/^[a-z0-9-_]+$/, {
    message: "API ID can only contain lowercase letters, numbers, hyphens, and underscores.",
  }),
  description: z.string().optional(),
  defaultView: z.enum(["grid", "list"]).default("grid"),
  defaultSorting: z.enum(["createdDate", "name", "updatedDate"]).default("createdDate"),
  itemsPerPage: z.enum(["10", "20", "50", "100"]).default("20"),
  enableApiAccess: z.boolean().default(true),
  requireAuthentication: z.boolean().default(false),
  enableVersioning: z.boolean().default(false)
});

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

const defaultValues: Partial<CollectionFormValues> = {
  name: "",
  apiId: "",
  description: "",
  defaultView: "grid",
  defaultSorting: "createdDate",
  itemsPerPage: "20",
  enableApiAccess: true,
  requireAuthentication: false,
  enableVersioning: false
};

interface CollectionFormProps {
  onCollectionCreated?: (data: CollectionFormData) => void;
  onClose?: () => void;
}

export function CollectionForm({ onCollectionCreated, onClose }: CollectionFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues,
  });

  function onSubmit(data: CollectionFormValues) {
    // Proceed to field configuration if on step 1, otherwise save the collection
    if (step === 1) {
      setStep(2);
    } else {
      // Call the onCollectionCreated callback with the form data
      if (onCollectionCreated) {
        onCollectionCreated({
          name: data.name,
          apiId: data.apiId,
          description: data.description,
          settings: {
            defaultView: data.defaultView,
            defaultSorting: data.defaultSorting,
            itemsPerPage: data.itemsPerPage,
            enableApiAccess: data.enableApiAccess,
            requireAuthentication: data.requireAuthentication,
            enableVersioning: data.enableVersioning,
          }
        });
      }
      
      // Reset the form
      form.reset();
    }
  }
  
  function handleSaveAsDraft() {
    const data = form.getValues();
    
    // Call the onCollectionCreated callback with draft status
    if (onCollectionCreated) {
      onCollectionCreated({
        name: data.name,
        apiId: data.apiId,
        description: data.description,
        status: 'draft',
        settings: {
          defaultView: data.defaultView,
          defaultSorting: data.defaultSorting,
          itemsPerPage: data.itemsPerPage,
          enableApiAccess: data.enableApiAccess,
          requireAuthentication: data.requireAuthentication,
          enableVersioning: data.enableVersioning,
        }
      });
    }
    
    toast({
      title: "Draft saved",
      description: `${data.name} collection saved as draft`,
    });
    
    // Close the dialog
    if (onClose) {
      onClose();
    }
  }

  // Auto-generate API ID from name
  const autoGenerateApiId = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with hyphens
      .replace(/[^a-z0-9-_]/g, '') // Remove invalid characters
      .substring(0, 50);           // Truncate if necessary
  };
  
  const handleIconUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="absolute right-4 top-4 z-10">
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 bg-white/20 hover:bg-white/40">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-blue-600 text-white p-6 -mx-6 -mt-6 mb-6">
        <h2 className="text-xl font-semibold">Create New Collection</h2>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8 px-4">
        <div className="relative flex items-center">
          <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800'} text-sm font-medium`}>
            1
          </div>
          <div className="flex-1 mx-2 text-center">
            <span className={`text-sm font-medium ${step === 1 ? 'text-blue-600' : 'text-blue-400'}`}>Collection Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 relative">
            <div className={`h-0.5 bg-blue-600 absolute top-0 left-0 ${step === 2 ? 'w-full' : 'w-0'} transition-all duration-300`}></div>
          </div>
          <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} text-sm font-medium`}>
            2
          </div>
          <div className="flex-1 mx-2 text-center">
            <span className={`text-sm font-medium ${step === 2 ? 'text-blue-600' : 'text-gray-500'}`}>Field Configuration</span>
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Name*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Products, Articles..." 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            
                            // Only auto-generate if the API ID field is empty or matches a previous auto-generation
                            const currentApiId = form.getValues("apiId");
                            const currentName = form.getValues("name");
                            if (!currentApiId || currentApiId === autoGenerateApiId(currentName)) {
                              form.setValue("apiId", autoGenerateApiId(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">Collection Icon</label>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {iconUrl ? (
                        <img src={iconUrl} alt="Collection icon" className="w-full h-full object-cover" />
                      ) : (
                        <Plus className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleIconUpload}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        Choose Icon
                      </Button>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="apiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Slug*</FormLabel>
                      <div className="flex">
                        <div className="bg-gray-100 border border-r-0 border-input rounded-l-md px-3 py-2 text-sm text-gray-500 flex items-center">
                          /api/
                        </div>
                        <FormControl>
                          <Input
                            className="rounded-l-none"
                            placeholder="collection-name"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Used in API endpoints and database. Only lowercase letters, numbers, hyphens, and underscores.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Collection Settings</h3>
                  
                  <FormField
                    control={form.control}
                    name="enableApiAccess"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Enable API access</FormLabel>
                          <FormDescription>
                            Make this collection accessible via API
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
                    name="requireAuthentication"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Require authentication</FormLabel>
                          <FormDescription>
                            Only authenticated users can access this collection
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
                    name="enableVersioning"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Enable versioning</FormLabel>
                          <FormDescription>
                            Keep track of changes to content items
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
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Description</h3>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of this collection..." 
                          className="resize-none h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Display Options</h3>
                  
                  <FormField
                    control={form.control}
                    name="defaultView"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default View</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a view" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="grid">Grid View</SelectItem>
                            <SelectItem value="list">List View</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="defaultSorting"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Sorting</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sorting" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="createdDate">Created Date (newest first)</SelectItem>
                            <SelectItem value="updatedDate">Updated Date</SelectItem>
                            <SelectItem value="name">Name (A-Z)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="itemsPerPage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Items Per Page</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="min-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed p-10">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Field Configuration</h3>
                <p className="text-gray-500 mb-4">Set up the schema for your collection here.</p>
                <p className="text-sm text-gray-400">You'll be able to add fields in the next step.</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-between pt-6 border-t">
            {step === 1 ? (
              <>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-blue-300 text-blue-600"
                    onClick={handleSaveAsDraft}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Continue to Fields
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <CirclePlus className="mr-2 h-4 w-4" />
                  Create Collection
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
