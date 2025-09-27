
'use client';

import { useState, useEffect } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, limit, getDocs, Query } from "firebase/firestore";
import { Product, ProductVariant } from "@/lib/types";

export type ProductWithFirstVariant = Product & { firstVariantImageUrl?: ProductVariant['imageUrl'] };

export function useProductsWithFirstVariant(productsQuery: Query | null) {
  const firestore = useFirestore();
  const { data: products, loading: productsLoading, error: productsError } = useCollection<Product>(productsQuery);

  const [productsWithImages, setProductsWithImages] = useState<ProductWithFirstVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the main products query is loading, we are also loading.
    if (productsLoading) {
      setLoading(true);
      return;
    }
    
    // If there's an error fetching products, stop loading and propagate error (optional).
    if (productsError) {
      setLoading(false);
      return;
    }

    // If products are null/undefined (e.g., query is not ready), stop loading.
    if (!products) {
      setLoading(false);
      setProductsWithImages([]);
      return;
    }
    
    // If there are no products, we are done loading and have an empty array.
    if (products.length === 0) {
      setLoading(false);
      setProductsWithImages([]);
      return;
    }
    
    let isCancelled = false;

    const fetchVariants = async () => {
      if (firestore) {
        setLoading(true);
        try {
          const productsWithVariants = await Promise.all(
            products.map(async (product) => {
              const variantsRef = collection(firestore, 'products', product.id, 'variants');
              const q = query(variantsRef, limit(1));
              const variantsSnap = await getDocs(q);
              if (!variantsSnap.empty) {
                const firstVariant = variantsSnap.docs[0].data() as ProductVariant;
                return { ...product, firstVariantImageUrl: firstVariant.imageUrl };
              }
              // Return product without image if no variants found
              return { ...product, firstVariantImageUrl: undefined }; 
            })
          );
          
          if (!isCancelled) {
            setProductsWithImages(productsWithVariants);
          }
        } catch (error) {
          console.error("Error fetching product variants:", error);
          if (!isCancelled) {
            // Set products without images in case of variant fetching error
            setProductsWithImages(products);
          }
        } finally {
          if (!isCancelled) {
            setLoading(false);
          }
        }
      }
    };

    fetchVariants();
    
    return () => {
      isCancelled = true;
    };
  }, [products, firestore, productsLoading, productsError]);

  return { productsWithImages, loading, error: productsError };
}
