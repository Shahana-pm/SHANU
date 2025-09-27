
'use client';

import { useState, useEffect } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, limit, getDocs, Query, DocumentData } from "firebase/firestore";
import { Product, ProductVariant } from "@/lib/types";

export type ProductWithFirstVariant = Product & { firstVariantImageUrl?: ProductVariant['imageUrl'] };

export function useProductsWithFirstVariant(productsQuery: Query | null) {
  const firestore = useFirestore();
  const { data: products, loading: productsLoading, error: productsError } = useCollection<Product>(productsQuery);

  const [productsWithImages, setProductsWithImages] = useState<ProductWithFirstVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs when the products list from useCollection changes.
    
    if (productsLoading) {
      setLoading(true);
      return;
    }

    if (productsError) {
      console.error("Error fetching products:", productsError);
      setLoading(false);
      return;
    }

    if (!products) {
      setProductsWithImages([]);
      setLoading(false);
      return;
    }
    
    if (products.length === 0) {
      setProductsWithImages([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchFirstVariantImages = async () => {
      if (!firestore) return;

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
            return { ...product, firstVariantImageUrl: undefined }; 
          })
        );
        
        if (!isCancelled) {
          setProductsWithImages(productsWithVariants);
        }
      } catch (error) {
        console.error("Error fetching product variants:", error);
        if (!isCancelled) {
          // In case of error fetching variants, still show products without images.
          setProductsWithImages(products);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchFirstVariantImages();

    return () => {
      isCancelled = true;
    };
    // We depend on `products` object itself. If its content changes, we must refetch variants.
    // JSON.stringify is a way to deep-compare the array of objects.
  }, [JSON.stringify(products), firestore, productsLoading, productsError]);

  return { productsWithImages, loading, error: productsError };
}
