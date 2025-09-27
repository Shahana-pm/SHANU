
'use client';

import { useState, useEffect } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { Product, ProductVariant } from "@/lib/types";
import { collection, getDocs, query, limit, Query } from "firebase/firestore";

export type ProductWithFirstVariant = Product & { firstVariantImageUrl?: ProductVariant['imageUrl'] };

export function useProductsWithImages(productsQuery: Query | null) {
  const firestore = useFirestore();
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);
  const [productsWithImages, setProductsWithImages] = useState<ProductWithFirstVariant[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(true);

  useEffect(() => {
    const fetchVariants = async () => {
      setVariantsLoading(true);
      if (products && firestore) {
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
              return product;
            })
          );
          setProductsWithImages(productsWithVariants);
        } catch (error) {
          console.error("Error fetching product variants:", error);
          setProductsWithImages(products); // Fallback to products without images on error
        }
      } else if (products) {
        setProductsWithImages(products);
      }
      setVariantsLoading(false);
    };

    fetchVariants();
  }, [products, firestore]);

  return { productsWithImages, loading: productsLoading || variantsLoading };
}
