
'use client';

import { useState, useEffect } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { Product, ProductVariant } from "@/lib/types";
import { collection, getDocs, query, limit, Query } from "firebase/firestore";

export type ProductWithFirstVariant = Product & { firstVariantImageUrl?: ProductVariant['imageUrl'] };

export function useProductsWithImages(productsQuery: Query | null) {
  const firestore = useFirestore();
  const { data: products, loading: productsLoading, error: productsError } = useCollection<Product>(productsQuery);
  
  const [productsWithImages, setProductsWithImages] = useState<ProductWithFirstVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (productsLoading) {
      setLoading(true);
      return;
    }
    if (productsError) {
      setError(productsError);
      setLoading(false);
      return;
    }
    if (!products || !firestore) {
      setLoading(false);
      setProductsWithImages([]);
      return;
    }
    if (products.length === 0) {
      setProductsWithImages([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    
    const fetchVariants = async () => {
      setLoading(true);
      try {
        const productsWithVariants = await Promise.all(
          products.map(async (product) => {
            const variantsRef = collection(firestore, 'products', product.id, 'variants');
            const q = query(variantsRef, limit(1));
            try {
              const variantsSnap = await getDocs(q);
              if (!variantsSnap.empty) {
                const firstVariant = variantsSnap.docs[0].data() as ProductVariant;
                return { ...product, firstVariantImageUrl: firstVariant.imageUrl };
              }
            } catch (e) {
              console.error(`Error fetching variant for product ${product.id}:`, e);
            }
            return product; // Return product without image if no variants or error
          })
        );
        
        if (!isCancelled) {
          setProductsWithImages(productsWithVariants);
          setError(null);
        }
      } catch (e: any) {
        console.error("Error fetching product variants:", e);
        if (!isCancelled) {
          setError(e);
          setProductsWithImages(products); // Fallback to products without images on error
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchVariants();

    return () => {
      isCancelled = true;
    };
  }, [products, productsLoading, productsError, firestore]);

  return { productsWithImages, loading, error };
}
