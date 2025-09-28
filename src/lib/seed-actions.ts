
'use server';

import { seedDatabaseFlow } from "@/ai/flows/seed-database";
import { run } from "genkit";


export async function seedDatabaseAction() {
    try {
        const result = await run(seedDatabaseFlow);
        if (!result.success) {
            throw new Error(result.message);
        }
        return { success: true, message: result.message };
    } catch (e: any) {
        console.error("Action failed:", e);
        return { success: false, message: e.message || "An unknown error occurred." };
    }
}
