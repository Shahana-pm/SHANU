'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useCollection } from '@/firebase';
import { Product, ProductVariant, ProductReview } from '@/lib/types';
import { doc, collection } from 'firebase/firestore';
import { useMemo } from 'react';
import EditProductForm from './edit-product-form';
import { notFound } from 'next/navigation';

export default function AdminProductEditPage() {
  const firestore = useFirestore();
  const params = useParams();
  const id = params.id as string;

  const productRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'products', id);
  }, [firestore, id]);

  const variantsRef = useMemo(() => {
    if (!firestore || !id) return null;
    return collection(firestore, 'products', id, 'variants');
  }, [firestore, id]);

  const reviewsRef = useMemo(() => {
    if (!firestore || !id) return null;
    return collection(firestore, 'products', id, 'reviews');
  }, [firestore, id]);

  const { data: product, loading: productLoading } = useDoc<Product>(productRef);
  const { data: variants, loading: variantsLoading } = useCollection<ProductVariant>(variantsRef);
  const { data: reviews, loading: reviewsLoading } = useCollection<ProductReview>(reviewsRef);

  const isLoading = productLoading || variantsLoading || reviewsLoading;

  if (isLoading) {
    return (
      <div>
        <h1 className="font-headline text-3xl font-bold mb-8">Edit Product</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-8">Edit: {product.name}</h1>
      <EditProductForm 
        product={product} 
        variants={variants || []} 
        reviews={reviews || []}
      />
    </div>
  );
}
