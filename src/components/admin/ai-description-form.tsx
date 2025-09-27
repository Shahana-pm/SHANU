"use client"

import { useState, useTransition } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDescriptionAction } from "@/lib/actions";
import type { GenerateProductDescriptionOutput } from "@/ai/flows/generate-product-description";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productCategory: z.string().min(2, {
    message: "Product category must be at least 2 characters.",
  }),
  keyFeatures: z.string().min(10, {
    message: "Please list at least one key feature.",
  }),
  targetAudience: z.string().min(2, {
    message: "Target audience must be at least 2 characters.",
  }),
  additionalDetails: z.string().optional(),
});

export function AiDescriptionForm() {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<GenerateProductDescriptionOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            productCategory: "",
            keyFeatures: "",
            targetAudience: "",
            additionalDetails: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setResult(null);
        startTransition(() => {
            generateDescriptionAction(values).then((res) => {
                if(res.error) {
                    toast({
                        variant: "destructive",
                        title: "Generation Failed",
                        description: res.error,
                    })
                }
                if(res.success) {
                    setResult(res.success);
                }
            })
        });
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Fill in the details about your product to generate content.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="productName" render={({ field }) => (<FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g. AeroFlex Chair" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="productCategory" render={({ field }) => (<FormItem><FormLabel>Product Category</FormLabel><FormControl><Input placeholder="e.g. Office Furniture" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="keyFeatures" render={({ field }) => (<FormItem><FormLabel>Key Features</FormLabel><FormControl><Textarea placeholder="e.g. Ergonomic design, breathable mesh, adjustable armrests" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="targetAudience" render={({ field }) => (<FormItem><FormLabel>Target Audience</FormLabel><FormControl><Input placeholder="e.g. Remote workers, designers" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="additionalDetails" render={({ field }) => (<FormItem><FormLabel>Additional Details (Optional)</FormLabel><FormControl><Textarea placeholder="e.g. Made from recycled materials, 5-year warranty" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate Content
                        </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Content</CardTitle>
                    <CardDescription>Here's the AI-generated content for your product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                {isPending && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {result ? (
                    <>
                        <div className="space-y-2">
                            <LabelForTextarea>Suggested Title</LabelForTextarea>
                            <Textarea readOnly value={result.suggestedTitle} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <LabelForTextarea>Product Description</LabelForTextarea>
                            <Textarea readOnly value={result.productDescription} rows={8} />
                        </div>
                        <div className="space-y-2">
                            <LabelForTextarea>SEO Keywords</LabelForTextarea>
                            <Textarea readOnly value={result.suggestedKeywords} rows={3} />
                        </div>
                    </>
                ) : (
                    !isPending && <div className="text-center text-muted-foreground py-16">Generated content will appear here.</div>
                )}
                </CardContent>
            </Card>
        </div>
    )
}

function LabelForTextarea({ children }: { children: React.ReactNode }) {
    return <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</p>
}
