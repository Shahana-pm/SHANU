
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
    if (productsLoading) {
      setLoading(true);
      return;
    }

    if (!firestore || !products) {
      setProductsWithImages([]);
      setLoading(false);
      return;
    }

    const fetchVariants = async () => {
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
        setProductsWithImages(productsWithVariants);
      } catch (error) {
        console.error("Error fetching product variants:", error);
        // Fallback to products without images on error
        setProductsWithImages(products);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();

  }, [products, productsLoading, firestore]);

  return { productsWithImages, loading: productsLoading || loading, error: productsError };
}
