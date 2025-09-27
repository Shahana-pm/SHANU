'use server';

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Reads the contents of the 'public/Product-img' directory and returns
 * an array of URL paths for the images found. This is a server action
 * and can only be run on the server.
 * @returns A promise that resolves to an array of image URL strings.
 */
export async function getPublicImageUrls(): Promise<string[]> {
  try {
    const imageDir = path.join(process.cwd(), 'public', 'Product-img');
    const files = await fs.readdir(imageDir);
    // Filter for common image extensions
    const imageFiles = files.filter((file: string) => /\.(png|jpe?g|gif|webp)$/i.test(file));
    return imageFiles.map((file: string) => `/Product-img/${file}`);
  } catch (error: any) {
    // If the directory doesn't exist, return an empty array. This is a
    // non-critical error as the user may not have created it yet.
    if (error.code === 'ENOENT') {
      console.warn("The directory 'public/Product-img' does not exist. Please create it and add your images.");
      return [];
    }
    // For other errors, log them for debugging.
    console.error("Error reading image directory:", error);
    // In case of an unexpected error, we can either throw it or return an empty array.
    // Returning an empty array provides a more graceful failure for the UI.
    return [];
  }
}
