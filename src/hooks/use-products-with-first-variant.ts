
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, limit, query, Query, CollectionReference } from 'firebase/firestore';
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

    const fetchProductsAndImages = async () => {
      setLoading(true);
      try {
        const productSnapshot = await getDocs(productsQuery);
        const products = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        const productsWithImagesPromises = products.map(async (product) => {
          const variantsRef = collection(firestore, 'products', product.id, 'variants');
          const q = query(variantsRef, limit(1));
          const variantSnap = await getDocs(q);
          let imageUrl: string | undefined = undefined;
          if (!variantSnap.empty) {
            const firstVariant = variantSnap.docs[0].data() as ProductVariant;
            imageUrl = firstVariant.imageUrl;
          }
          return { ...product, firstVariantImageUrl: imageUrl };
        });

        const resolvedProducts = await Promise.all(productsWithImagesPromises);
        setProductsWithImages(resolvedProducts);
      } catch (error) {
        console.error("Error fetching products with variants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndImages();
  }, [productsQuery, firestore]);

  return { productsWithImages, loading };
}
