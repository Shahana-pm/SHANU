"use client"

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
});

export default function EditProductForm({ product }: { product: Product }) {
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
    },
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
    try {
      const productRef = doc(firestore, "products", product.id);
      await updateDoc(productRef, values);
      
      toast({
        title: "Product Saved!",
        description: `${values.name} has been updated.`,
      });
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not save the product. Please try again.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
          <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />

                  <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                      <Button type="submit">Save Changes</Button>
                  </div>
              </form>
          </Form>
      </CardContent>
    </Card>
  )
}
