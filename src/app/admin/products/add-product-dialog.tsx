
"use client"
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore } from "@/firebase";
import { doc, writeBatch, collection } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { PlusCircle, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/image-uploader";


const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex code"),
  imageUrl: z.string().min(1, "An image must be selected."),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  isNew: z.boolean(),
  isTrending: z.boolean(),
  variants: z.array(variantSchema).min(1, "At least one product variant is required."),
});

export function AddProductDialog() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      description: "",
      isNew: true,
      isTrending: false,
      variants: [{ color: "", colorHex: "#000000", imageUrl: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore is not available.",
      });
      return;
    }

    const batch = writeBatch(firestore);
    const newProductRef = doc(collection(firestore, "products"));

    const { variants: formVariants, ...productData } = values;

    batch.set(newProductRef, productData);

    formVariants.forEach(variant => {
      const variantRef = doc(collection(firestore, "products", newProductRef.id, "variants"));
      const variantData = {
        color: variant.color,
        colorHex: variant.colorHex,
        imageUrl: variant.imageUrl,
      };
      batch.set(variantRef, variantData);
    });


    try {
        await batch.commit();
        toast({
            title: "Product Saved!",
            description: `${values.name} has been saved successfully!`,
        });
        form.reset();
        setOpen(false);
    } catch (serverError: any) {
      const permissionError = new FirestorePermissionError({
        path: `/products/${newProductRef.id}`,
        operation: 'create',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not create product. Check permissions or console for details.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                    Fill in all the details for your new product, including at least one variant.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Card className="flex-1">
                                <CardHeader>
                                    <CardTitle>Product Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <div className="flex items-center space-x-8">
                                    <FormField
                                        control={form.control}
                                        name="isNew"
                                        render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5 mr-4">
                                            <FormLabel>New Collection</FormLabel>
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
                                        name="isTrending"
                                        render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5 mr-4">
                                            <FormLabel>Trending</FormLabel>
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
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Variants</CardTitle>
                                <CardDescription>Manage the different colors and images for this product.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-muted/20">
                                        <FormField control={form.control} name={`variants.${index}.color`} render={({ field }) => (<FormItem><FormLabel>Color Name</FormLabel><FormControl><Input placeholder="e.g., Midnight Black" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`variants.${index}.colorHex`} render={({ field }) => (<FormItem><FormLabel>Color Hex</FormLabel><FormControl><Input placeholder="#000000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        
                                        <FormField
                                            control={form.control}
                                            name={`variants.${index}.imageUrl`}
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Primary Image</FormLabel>
                                                <FormControl>
                                                    <ImageUploader 
                                                        onImageSelect={(url) => field.onChange(url)}
                                                        initialImageUrl={field.value}
                                                    />
                                                </FormControl>
                                                <FormDescription>Select an image from the 'public/Product-img' folder.</FormDescription>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {fields.length > 1 && (
                                            <Button type="button" variant="destructive" size="icon" className="absolute top-4 right-4" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => append({ color: '', colorHex: '#000000', imageUrl: '' })}>
                                    <PlusCircle className="mr-2 h-4 w-4"/> Add Variant
                                </Button>
                                <FormMessage>{form.formState.errors.variants?.message}</FormMessage>
                            </CardContent>
                        </Card>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Product</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}
