
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, limit, query, onSnapshot, Query, CollectionReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Product, ProductVariant } from '@/lib/types';

interface ProductWithImage extends Product {
  firstVariantImageUrl?: string;
}

export function useProductsWithFirstVariant(productsQuery: Query | CollectionReference | null) {
  const [productsWithImages, setProductsWithImages] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!productsQuery || !firestore) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(productsQuery, async (productSnapshot) => {
      // This line is crucial. It ensures we start fresh on every update.
      const currentProducts: ProductWithImage[] = [];

      const products = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

      for (const product of products) {
        const variantsRef = collection(firestore, 'products', product.id, 'variants');
        const q = query(variantsRef, limit(1));
        const variantSnap = await getDocs(q);
        
        let imageUrl: string | undefined = undefined;
        if (!variantSnap.empty) {
          const firstVariant = variantSnap.docs[0].data() as ProductVariant;
          imageUrl = firstVariant.imageUrl;
        }
        currentProducts.push({ ...product, firstVariantImageUrl: imageUrl });
      }
      
      setProductsWithImages(currentProducts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products with variants:", error);
      setProductsWithImages([]); // Clear data on error
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productsQuery, firestore]);

  return { productsWithImages, loading };
}
