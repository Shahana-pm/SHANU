'use client';
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { useDoc, useFirestore, useCollection } from "@/firebase";
import { Product, ProductVariant, ProductReview } from "@/lib/types";
import { doc, collection } from "firebase/firestore";
import { useMemo } from "react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const firestore = useFirestore();
  const { slug } = params;

  const productRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "products", slug);
  }, [firestore, slug]);

  const variantsRef = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "products", slug, "variants");
  }, [firestore, slug]);

  const reviewsRef = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "products", slug, "reviews");
  }, [firestore, slug]);

  const { data: product, loading: productLoading } = useDoc<Product>(productRef);
  const { data: variants, loading: variantsLoading } = useCollection<ProductVariant>(variantsRef);
  const { data: reviews, loading: reviewsLoading } = useCollection<ProductReview>(reviewsRef);

  const loading = productLoading || variantsLoading || reviewsLoading;

  if (loading) {
    return <div className="container py-8 md:py-12">Loading...</div>;
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductGallery product={product} variants={variants || []} />
        <ProductInfo product={product} variants={variants || []} reviews={reviews || []} />
      </div>
    </div>
  );
}
