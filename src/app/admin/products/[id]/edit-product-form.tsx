"use client"

import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Product, ProductVariant, ProductReview } from "@/lib/types";
import { useFirestore } from "@/firebase";
import { doc, writeBatch, collection } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { PlusCircle, Trash2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex code"),
  imageIds: z.array(z.string()).min(1, "At least one image ID is required"),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  variants: z.array(variantSchema),
});

type EditProductFormProps = {
  product: Product;
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export default function EditProductForm({ product, variants, reviews }: EditProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      price: product?.price || 0,
      description: product?.description || "",
      variants: variants || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !product?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore is not available or product ID is missing.",
      });
      return;
    }

    const batch = writeBatch(firestore);
    const productRef = doc(firestore, "products", product.id);

    // Exclude variants from the main product data
    const { variants, ...productData } = values;
    batch.update(productRef, productData);

    // Handle variants subcollection
    values.variants.forEach(variant => {
      // If variant has an ID, it exists. If not, it's new.
      const variantRef = variant.id
        ? doc(firestore, "products", product.id, "variants", variant.id)
        : doc(collection(firestore, "products", product.id, "variants"));
      
      batch.set(variantRef, {
        color: variant.color,
        colorHex: variant.colorHex,
        imageIds: variant.imageIds
      });
    });

    // TODO: Handle variant deletion. For now, we only add/update.

    batch.commit()
      .then(() => {
        toast({
          title: "Product Saved!",
          description: `${values.name} has been updated.`,
        });
        router.push("/admin/products");
        router.refresh(); // This helps in re-fetching the updated list
      })
      .catch((serverError: any) => {
        console.error("Error saving product: ", serverError);
        const permissionError = new FirestorePermissionError({
          path: productRef.path,
          operation: 'update',
          requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Could not save product. Check permissions or console for details.",
        });
      });
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
            </Card>

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
                              name={`variants.${index}.imageIds.0`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Primary Image</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an image" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {PlaceHolderImages.map(img => (
                                        <SelectItem key={img.id} value={img.id}>
                                          {img.description} ({img.id})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>This is the main image for this product variant.</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button type="button" variant="destructive" size="icon" className="absolute top-4 right-4" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                     <Button type="button" variant="outline" onClick={() => append({ color: '', colorHex: '#000000', imageIds: [''] })}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Variant
                    </Button>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    </Form>
  )
}
