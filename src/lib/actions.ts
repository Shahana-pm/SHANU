"use server";

import { generateProductDescription, type GenerateProductDescriptionInput } from "@/ai/flows/generate-product-description";
import { z } from "zod";

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


export async function generateDescriptionAction(values: z.infer<typeof formSchema>) {
    
    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }
    
    try {
        const result = await generateProductDescription(validatedFields.data as GenerateProductDescriptionInput);
        return { success: result };
    } catch (error) {
        console.error(error);
        return {
            error: "Failed to generate description. Please try again.",
        };
    }

}
