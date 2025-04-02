
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { CirclePlus, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogClose } from '@/components/ui/dialog';
import { CollectionFormData } from '@/services/CollectionService';

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
});

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

const defaultValues: Partial<CollectionFormValues> = {
  name: "",
  apiId: "",
  description: "",
};

interface CollectionFormProps {
  onCollectionCreated?: (data: CollectionFormData) => void;
}

export function CollectionForm({ onCollectionCreated }: CollectionFormProps) {
  const [step, setStep] = useState<'basics' | 'advanced'>('basics');
  
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues,
  });

  function onSubmit(data: CollectionFormValues) {
    // Call the onCollectionCreated callback with the form data
    if (onCollectionCreated) {
      onCollectionCreated(data);
    }
    
    // Reset the form
    form.reset();
  }

  // Auto-generate API ID from name
  const autoGenerateApiId = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with hyphens
      .replace(/[^a-z0-9-_]/g, '') // Remove invalid characters
      .substring(0, 50);           // Truncate if necessary
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basics">Basic Information</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Blog Posts, Products, Team Members" 
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
                  <FormDescription>
                    A descriptive name for your content collection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. blog-posts, products, team-members" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used in API endpoints and database. Only lowercase letters, numbers, hyphens, and underscores.
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
                      placeholder="Describe the purpose of this collection..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Help your team understand what this collection is for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">Database Settings</span>
              </div>
              <p className="text-sm text-gray-500">
                Advanced database settings will be available after creating the collection.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="bg-cms-blue hover:bg-blue-700">
            <CirclePlus className="mr-2 h-4 w-4" />
            Create Collection
          </Button>
        </div>
      </form>
    </Form>
  );
}
