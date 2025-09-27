
"use client"
import * as React from "react";
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
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/image-uploader";


const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex code"),
  imageUrl: z.string().nullable().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  isNew: z.boolean(),
  isTrending: z.boolean(),
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
      isNew: product?.isNew || false,
      isTrending: product?.isTrending || false,
      variants: variants || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  
  const [removedVariants, setRemovedVariants] = React.useState<string[]>([]);

  const handleRemoveVariant = (index: number) => {
    const variantId = fields[index].id;
    if (variantId) {
      setRemovedVariants(prev => [...prev, variantId]);
    }
    remove(index);
  }

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

    const { variants: formVariants, ...productData } = values;

    batch.update(productRef, productData);

    formVariants.forEach(variant => {
      const variantRef = variant.id
        ? doc(firestore, "products", product.id, "variants", variant.id)
        : doc(collection(firestore, "products", product.id, "variants"));

      const variantData = {
        color: variant.color,
        colorHex: variant.colorHex,
        imageUrl: variant.imageUrl,
      };
      
      batch.set(variantRef, variantData, { merge: true });
    });

    removedVariants.forEach(variantId => {
        const variantRef = doc(firestore, "products", product.id, "variants", variantId);
        batch.delete(variantRef);
    });

    try {
        await batch.commit();
        toast({
            title: "Product Saved!",
            description: `${values.name} has been updated.`,
        });
        router.push("/admin/products");
        router.refresh();
    } catch (serverError: any) {
      const permissionError = new FirestorePermissionError({
        path: `/products/${product.id}`,
        operation: 'update',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save product. Check permissions or console for details.",
      });
    }
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
                                      onUploadSuccess={(url) => field.onChange(url)}
                                      initialImageUrl={field.value}
                                    />
                                  </FormControl>
                                  <FormDescription>Upload the main image for this product variant.</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button type="button" variant="destructive" size="icon" className="absolute top-4 right-4" onClick={() => handleRemoveVariant(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                     <Button type="button" variant="outline" onClick={() => append({ color: '', colorHex: '#000000', imageUrl: '' })}>
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
