import type { Product } from '@/lib/types';

// This file is being deprecated. Product data will be fetched from Firestore.
export const products: Product[] = [];

export const getProductById = (id: string): Product | undefined => {
  console.warn("`getProductById` is deprecated. Fetch data from Firestore instead.");
  return undefined;
}
